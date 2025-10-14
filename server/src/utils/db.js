const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGO_URI;
  console.log('🔌 Intentando conectar a MongoDB...');
  console.log('📍 MONGO_URI:', uri ? 'configurado' : 'NO CONFIGURADO');
  
  try {
    if (!uri) {
      console.log('⚠️  MONGO_URI no configurado, MongoDB no disponible');
      throw new Error('MONGO_URI not set');
    }
    
    mongoose.set('strictQuery', true);
    console.log('🔄 Conectando a MongoDB...');
    
    await mongoose.connect(uri, { 
      autoIndex: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    
    console.log('✅ Conexión a MongoDB establecida exitosamente');
    console.log('📊 Base de datos:', mongoose.connection.name);
  } catch (e) {
    console.error('❌ Error conectando a MongoDB:');
    console.error('   Mensaje:', e.message);
    console.error('   Código:', e.code);
    console.error('   Stack:', e.stack);
    throw e;
  }
}

module.exports = connectDb;
