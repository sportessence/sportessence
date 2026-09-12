export type Profile = {
  id: string; 
  email: string; 
  nome: string; 
  cognome: string; 
  cf: string; 
  telefono: string;
  email_contatti: string; 
  indirizzo_via: string; 
  indirizzo_civico: string;
  indirizzo_cap: string; 
  indirizzo_paese: string; 
  indirizzo_provincia: string;
};

export type Child = {
  id: string; 
  nome: string; 
  cognome: string; 
  data_nascita: string; 
  cf: string;
  taglia_maglietta: string; 
  intolleranze: string[]; 
  parent_id: string;
};

export type CampWeek = { 
  id: string; 
  label: string; 
  data_inizio: string; 
  data_fine: string; 
};

export type PricingTier = { 
  price_per_week: number; 
  min_weeks: number; 
  discount_percent: number; 
};

export type Camp = { 
  id: string; 
  nome: string; 
  indirizzo_paese: string;
  sibling_discount_value: number; 
  sibling_discount_week_price: number;
  prezzo_base_indicativo: number; 
  price_half_day: number;
  price_pre: number;
  price_post: number;
  price_pre_post_bundle: number;
  camp_weeks: CampWeek[];
  camp_pricing_tiers: PricingTier[];
};

export type QuoteDetail = {
  week_id: string;
  selected: boolean;
  type: 'FULL' | 'HALF';
  prePost: 'NONE' | 'PRE' | 'POST' | 'BOTH';
  
  price: number;        
  originalPrice: number; 
  discountReason?: string; 
  
  is_full: boolean;
  extraPrice: number; 
  is_new?: boolean;
  created_at?: string; 
};

export type LocalQuote = {
  tuition: number;
  extras: number;
  discountSibling: number;
  discountPromo: number;
  registrationFee: number;
  total: number;
  details: QuoteDetail[];
};

export type ExistingBooking = {
  camp_week_id: string;
  type: 'FULL' | 'HALF';
  prePost: 'NONE' | 'PRE' | 'POST' | 'BOTH';
  created_at?: string; 
};

export type Enrollment = {
  id: string; 
  child_id: string; 
  camp_id: string; 
  created_at: string;
  prezzo_totale: number; 
  pagato: number; 
  saldata: boolean; 
  stato: string; 
  camps: { 
    nome: string; 
    indirizzo_via: string; 
    indirizzo_paese: string; 
  };
  enrollment_weeks: { 
    camp_weeks: { 
      data_inizio: string; 
      data_fine: string; 
    } 
  }[];
};
