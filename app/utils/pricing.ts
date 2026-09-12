import { Camp, QuoteDetail, LocalQuote, ExistingBooking } from '../types/iscrizione';

type CalculateQuoteParams = {
  campObj: Camp;
  weekSelections: Record<string, { selected: boolean, type: 'FULL' | 'HALF', prePost: 'NONE' | 'PRE' | 'POST' | 'BOTH' }>;
  bookedWeeks: ExistingBooking[];
  bookedWeekIds: string[];
  alreadyBilledAmount: number;
  isPromoApplied: boolean;
  siblingWeekIds: Set<string>;
  siblingWeekDates: Record<string, string>;
  currentPromoValue: number;
};

export function calculateQuote({
  campObj,
  weekSelections,
  bookedWeeks,
  bookedWeekIds,
  alreadyBilledAmount,
  isPromoApplied,
  siblingWeekIds,
  siblingWeekDates,
  currentPromoValue
}: CalculateQuoteParams): LocalQuote | null {
  
  const isWeekBooked = (wid: string) => bookedWeekIds.includes(wid);
  const selectedIds = Object.keys(weekSelections).filter(k => weekSelections[k].selected && !isWeekBooked(k));
  
  if (selectedIds.length === 0) {
    return null;
  }

  const newWeeksDetails = selectedIds.map(wid => ({ 
    week_id: wid, 
    ...weekSelections[wid], 
    is_new: true, 
    created_at: undefined 
  }));
  
  const oldWeeksDetails = bookedWeeks.map(bw => ({ 
      week_id: bw.camp_week_id, 
      type: bw.type, 
      prePost: bw.prePost, 
      selected: true, 
      is_new: false, 
      created_at: bw.created_at 
  }));
  
  const allWeeks = [...oldWeeksDetails, ...newWeeksDetails];
  const fullWeeks = allWeeks.filter(w => w.type === 'FULL');
  
  // 1. TIER CALCULATION
  const numFullWeeks = fullWeeks.length;
  const tiers = campObj.camp_pricing_tiers || [];
  const sortedTiers = [...tiers].sort((a, b) => a.min_weeks - b.min_weeks);
  
  const activeTierObj = [...sortedTiers].reverse().find(t => numFullWeeks >= t.min_weeks);
  
  const baseStandardPrice = campObj.prezzo_base_indicativo;
  let tierBasePrice = activeTierObj?.price_per_week || baseStandardPrice;
  const discountPercentTier = activeTierObj?.discount_percent || 0;

  if (tierBasePrice === 0 && activeTierObj) {
     const prevTier = sortedTiers.filter(t => t.min_weeks < activeTierObj.min_weeks && t.price_per_week > 0).pop();
     if (prevTier) tierBasePrice = prevTier.price_per_week;
  }

  const discountedTierPrice = tierBasePrice * (1 - (discountPercentTier / 100));

  // 2. CALCOLO DETTAGLIATO
  let grandTuition = 0;
  let grandExtras = 0;
  let grandSiblingDiscount = 0;
  
  const allCalculatedDetails = allWeeks.map(w => {
      let price = 0;
      let originalPrice = 0;
      let discountReason = undefined;
      let extra = 0;

      if (w.type === 'HALF') {
          price = campObj.price_half_day;
          originalPrice = campObj.price_half_day;
      } else {
          originalPrice = baseStandardPrice;
          
          // Verifica Overlap Fratelli 
          const hasOverlapRaw = siblingWeekIds.has(w.week_id);
          let hasOverlap = hasOverlapRaw;

          // Check Temporale: se è una settimana passata, vediamo CHI si è iscritto prima
          if (hasOverlapRaw && !w.is_new && w.created_at && siblingWeekDates[w.week_id]) {
              const myDate = new Date(w.created_at);
              const sibDate = new Date(siblingWeekDates[w.week_id]);
              // Se il fratello si è iscritto DOPO di me, non c'era sconto. Non ricalcolarlo.
              if (sibDate > myDate) {
                  hasOverlap = false; 
              }
          }
          
          if (hasOverlap && campObj.sibling_discount_week_price > 0) {
              price = campObj.sibling_discount_week_price;
              discountReason = "Sconto Fratello";
          } else {
              price = discountedTierPrice;
              
              if (discountPercentTier > 0) {
                  discountReason = `Tier ${activeTierObj?.min_weeks} sett.`;
              }

              if (hasOverlap) {
                  if (campObj.sibling_discount_value > 0 && campObj.sibling_discount_value <= 1) {
                      grandSiblingDiscount += price * campObj.sibling_discount_value;
                      discountReason = discountReason ? `${discountReason} + Fratello` : "Sconto Fratello";
                  } else if (campObj.sibling_discount_value > 1) {
                      grandSiblingDiscount += Number(campObj.sibling_discount_value);
                      discountReason = discountReason ? `${discountReason} + Fratello` : "Sconto Fratello";
                  }
              }
          }
      }
      
      if (w.prePost === 'BOTH') extra = campObj.price_pre_post_bundle || (campObj.price_pre + campObj.price_post);
      else if (w.prePost === 'PRE') extra = campObj.price_pre;
      else if (w.prePost === 'POST') extra = campObj.price_post;

      grandTuition += price;
      grandExtras += extra;

      return { 
          ...w, 
          price, 
          originalPrice,
          discountReason,
          extraPrice: extra, 
          is_full: w.type === 'FULL' 
      };
  });

  let grandPromoDiscount = 0;
  if (isPromoApplied) {
   grandPromoDiscount = grandTuition * Number(currentPromoValue); 
  }

  const registrationFee = 15;

  const grandTotal = Math.max(0, grandTuition + grandExtras - grandSiblingDiscount - grandPromoDiscount) + registrationFee;
  const toPayNow = Math.max(0, grandTotal - alreadyBilledAmount);

  const newWeeksDisplay = allCalculatedDetails.filter(d => d.is_new);

  return {
    tuition: grandTuition,
    extras: grandExtras,
    discountSibling: grandSiblingDiscount,
    discountPromo: grandPromoDiscount,
    registrationFee: registrationFee,
    total: toPayNow,
    details: newWeeksDisplay as QuoteDetail[] 
  };
}
