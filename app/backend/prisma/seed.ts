import "dotenv/config";
import { PrismaClient } from "generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function parseCSV(filename: string): Promise<string[][]> {
  const filePath = path.join(__dirname, 'data', filename);
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  return lines.slice(1).map(line => {
    // Handle CSV with quoted fields
    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
    return line.split(regex).map(field => field.trim().replace(/^"|"$/g, ''));
  });
}

async function clearLOVTables() {
  console.log('Clearing existing LOV tables...\n');

  try {
    // Delete in reverse order of dependencies to avoid FK constraint violations
    console.log('Deleting Industry Specialisations...');
    await prisma.industrySpecialisation.deleteMany({});
    
    console.log('Deleting Industry Sub-Categories...');
    await prisma.industrySubCategory.deleteMany({});
    
    console.log('Deleting Industry Categories...');
    await prisma.industryCategory.deleteMany({});
    
    console.log('Deleting Engagement Models...');
    await prisma.engagementModel.deleteMany({});
    
    console.log('Deleting Incentive Methods...');
    await prisma.incentiveMethod.deleteMany({});
    
    console.log('Deleting Years of Experience...');
    await prisma.yearsOfExperience.deleteMany({});
    
    console.log('Deleting Business Structures...');
    await prisma.buisnessStructure.deleteMany({});
    
    console.log('Deleting Certifications...');
    await prisma.certification.deleteMany({});
    
    console.log('Deleting Tool Platforms...');
    await prisma.toolPlatform.deleteMany({});

    console.log('All LOV tables cleared successfully\n');
  } catch (error) {
    console.error('Error clearing tables:', error);
    throw error;
  }
}

// ============================================
// SEEDING FUNCTIONS
// ============================================

async function seedIndustries() {
  console.log(' Seeding industries...');
  
  const rows = await parseCSV('industry.csv');
  const categoryMap = new Map<string, string>();
  const subCategoryMap = new Map<string, string>();

  for (const [categoryName, subCategoryName, specializationNames] of rows) {
    // 1. Create or get Industry Category
    let categoryId = categoryMap.get(categoryName);
    if (!categoryId) {
      const category = await prisma.industryCategory.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      });
      categoryId = category.id;
      categoryMap.set(categoryName, categoryId);
      console.log(` Category: ${categoryName}`);
    }

    // 2. Create or get Industry Sub-Category
    const subCategoryKey = `${categoryName}|${subCategoryName}`;
    let subCategoryId = subCategoryMap.get(subCategoryKey);
    if (!subCategoryId) {
      const subCategory = await prisma.industrySubCategory.upsert({
        where: { 
          name_categoryId: { 
            name: subCategoryName, 
            categoryId 
          } 
        },
        update: {},
        create: { 
          name: subCategoryName, 
          categoryId 
        },
      });
      subCategoryId = subCategory.id;
      subCategoryMap.set(subCategoryKey, subCategoryId);
      console.log(`   Sub-Category: ${subCategoryName}`);
    }

    // 3. Create Industry Specializations
    const specializations = specializationNames.split(',').map(s => s.trim());
    for (const specName of specializations) {
      if (specName) {
        await prisma.industrySpecialisation.upsert({
          where: { 
            name_subCategoryId: { 
              name: specName, 
              subCategoryId 
            } 
          },
          update: {},
          create: { 
            name: specName, 
            subCategoryId 
          },
        });
        console.log(`Specialization: ${specName}`);
      }
    }
  }

  console.log('Industries seeded successfully\n');
}

async function seedEngagementModelsAndIncentives() {
  console.log('Seeding engagement models and incentive methods...');
  
  const rows = await parseCSV('engagement-model.csv');

  for (const [modelName, incentiveName, description] of rows) {
    // Create Engagement Model
    await prisma.engagementModel.upsert({
      where: { name: modelName },
      update: { description: description || null },
      create: { 
        name: modelName, 
        description: description || null 
      },
    });
    console.log(` Engagement Model: ${modelName}`);

    // Create Incentive Method
    if (incentiveName && incentiveName !== '-') {
      await prisma.incentiveMethod.upsert({
        where: { name: incentiveName },
        update: {},
        create: { name: incentiveName },
      });
      console.log(` Incentive Method: ${incentiveName}`);
    }
  }

  console.log(' Engagement models and incentive methods seeded successfully\n');
}

async function seedYearsOfExperience() {
  console.log(' Seeding years of experience...');
  
  const rows = await parseCSV('yoe.csv');

  for (const [, range] of rows) {
    await prisma.yearsOfExperience.upsert({
      where: { range },
      update: {},
      create: { range },
    });
    console.log(` Years of Experience: ${range}`);
  }

  console.log(' Years of experience seeded successfully\n');
}

async function seedBusinessStructures() {
  console.log(' Seeding business structures...');
  
  const rows = await parseCSV('business-model.csv');

  for (const [, name] of rows) {
    await prisma.buisnessStructure.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(` Business Structure: ${name}`);
  }

  console.log(' Business structures seeded successfully\n');
}

async function seedCertifications() {
  console.log(' Seeding certifications...');
  
  // Seed fresh data
  const rows = await parseCSV('qualifications.csv');

  for (const [, name] of rows) {
    await prisma.certification.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(` Certification: ${name}`);
  }

  console.log(' Certifications seeded successfully\n');
}

async function seedToolPlatforms() {
  console.log(' Seeding tool platforms...');
  
  const rows = await parseCSV('tools.csv');

  for (const [, name] of rows) {
    await prisma.toolPlatform.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(` Tool Platform: ${name}`);
  }

  console.log(' Tool platforms seeded successfully\n');
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
  console.log('Starting database seeding...\n');

  try {
    await clearLOVTables();

    await seedIndustries();
    await seedEngagementModelsAndIncentives();
    await seedYearsOfExperience();
    await seedBusinessStructures();
    await seedCertifications();
    await seedToolPlatforms();

    console.log('All seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });