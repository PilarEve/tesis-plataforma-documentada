/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gexfcndaymqdnuobjxnb.supabase.co';
const supabaseAnonKey = 'sb_publishable_qyzs56H5QD7AXb53GKd48Q_ruiGV-rj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertReport() {
  const { data, error } = await supabase
    .from('reportes')
    .insert([
      {
        latitud: -25.2950,
        longitud: -57.6250,
        descripcion: 'Acumulación importante de agua sobre la calzada tras lluvias intensas. El agua cubre parcialmente las veredas y dificulta el tránsito vehicular.',
        imagen_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1000&auto=format&fit=crop',
        afectaciones: ['Calle inundada', 'Interrupción de tránsito']
      }
    ]);

  if (error) {
    console.error('Error inserting report:', error);
    process.exit(1);
  } else {
    console.log('Report inserted successfully:', data);
  }
}

insertReport();
