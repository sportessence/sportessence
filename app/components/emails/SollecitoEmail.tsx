import * as React from 'react';

interface SollecitoEmailProps {
  parentName: string;
  childName: string;
  childCF: string;
  campName: string;
  amountDue: number; // L'importo rimanente da saldare
  iban: string;
  reservationId: string;
}

export const SollecitoEmail: React.FC<SollecitoEmailProps> = ({
  parentName,
  childName,
  childCF,
  campName,
  amountDue,
  iban,
  reservationId
}) => {
  // Logica causale (stessa usata nell'iscrizione ma per il saldo)
  const shortId = reservationId ? reservationId.slice(0, 8).toUpperCase() : '---';
  const causale = `Saldo ${childName} - ${campName} (Rif: ${shortId} - CF: ${childCF})`;

  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#333', lineHeight: '1.5' }}>
      <h1 style={{ color: '#0891b2', marginBottom: '24px' }}>Promemoria di Pagamento</h1>
      
      <p style={{ fontSize: '16px' }}>Gentile <strong>{parentName}</strong>,</p>
      
      <p style={{ fontSize: '16px' }}>
        Ti ricordiamo che l'iscrizione di <strong>{childName}</strong> al campo <strong>{campName}</strong> risulta avere ancora una quota da saldare.
      </p>
      <p style={{ fontSize: '16px', marginTop: '16px' }}>
        Ti preghiamo di effettuare il pagamento del saldo rimanente il prima possibile per completare definitivamente l'iscrizione.
      </p>
      
      <div style={{ background: '#fffbeb', padding: '24px', borderRadius: '12px', border: '1px solid #fcd34d', margin: '30px 0' }}>
        <h3 style={{ marginTop: 0, color: '#92400e' }}>Dettagli per il Bonifico</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#78350f', fontSize: '14px' }}>Importo Residuo:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold', fontSize: '18px', color: '#000' }}>€{amountDue.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#78350f', fontSize: '14px' }}>IBAN:</td>
              <td style={{ padding: '8px 0', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>{iban}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#78350f', fontSize: '14px' }}>Intestatario:</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Sport Essence</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#78350f', fontSize: '14px', verticalAlign: 'top' }}>Causale:</td>
              <td style={{ padding: '8px 0', fontStyle: 'italic', background: '#fff', border: '1px solid #fae8b4', paddingLeft: '8px', borderRadius: '4px' }}>
                {causale}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '14px', color: '#666' }}>
        Se hai già provveduto al pagamento nelle ultime 48 ore, ti preghiamo di ignorare questa comunicazione.
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />
      
      <p style={{ fontSize: '12px', color: '#999' }}>
        SportEssence ASD<br/>
        Questa è una email automatica, non rispondere direttamente.
      </p>
    </div>
  );
};

export default SollecitoEmail;
