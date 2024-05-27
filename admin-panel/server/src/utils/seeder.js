const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main () {
  const userId = '5c7a4219-0702-436b-9a4d-5a9e81a6f534'

  const samples = []

  for (let i = 0; i < 30; i++) {
    samples.push({
      N: parseFloat((Math.random() * 20).toFixed(1)),
      P: parseFloat((Math.random() * 15).toFixed(1)),
      K: parseFloat((Math.random() * 25).toFixed(1)),
      temperature: parseFloat((20 + Math.random() * 10).toFixed(1)),
      humidity: parseFloat((50 + Math.random() * 20).toFixed(1)),
      ph: parseFloat((6 + Math.random() * 2).toFixed(1))
    })
  }

  for (const sample of samples) {
    await prisma.sample.create({
      data: {
        ...sample,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  }

  console.log('Seeding completed')
}

try {
  main()
} catch (error) {
  console.log(error)
}
