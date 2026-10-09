const validateEnv = () => {
  const requiredEnv = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
  const missingEnv = requiredEnv.filter((env) => !process.env[env]);

  if (missingEnv.length > 0) {
    console.error(`❌ Error: Environment variables missing: ${missingEnv.join(', ')}`);
    process.exit(1);
  } else {
    console.log('✅ Environment variables validated successfully.');
  }
};

module.exports = validateEnv;