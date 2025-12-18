import { Material, PrismaClient } from '../generated/prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {

  const toys = [
    { name: 'Wooden Train', material: Material.wood, weight: 1.2 },
    { name: 'Metal Robot', material: Material.metal, weight: 2.5 },
    { name: 'Plastic Blocks', material: Material.plastic, weight: 0.8 },
    { name: 'Snow Puzzle', material: Material.other, weight: 0.4 },
  ];

  const toysByName = new Map<string, { id: number }>();
  for (const toy of toys) {
    const created = await prisma.toy.create({ data: toy });
    toysByName.set(created.name, created);
  }

  const children = [
    {
      name: 'Anna',
      address: '123 North Pole Way',
      good: true,
      toyNames: ['Wooden Train', 'Plastic Blocks'],
    },
    {
      name: 'Ben',
      address: '456 Snow Street',
      good: false,
      toyNames: ['Metal Robot'],
    },
    {
      name: 'Cara',
      address: '789 Ice Road',
      good: true,
      toyNames: ['Snow Puzzle', 'Plastic Blocks'],
    },
  ];

  for (const child of children) {
    await prisma.child.create({
      data: {
        name: child.name,
        address: child.address,
        good: child.good,
        toys: {
          create: child.toyNames.map((toyName) => {
            const toy = toysByName.get(toyName);
            if (!toy) throw new Error(`Missing toy '${toyName}' while linking child '${child.name}'`);
            return { toyId: toy.id };
          }),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
