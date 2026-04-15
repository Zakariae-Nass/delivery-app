import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Admin } from './users/entities/admin.entity';
import { Agency } from './users/entities/agency.entity';
import { Delivery } from './users/entities/delivery.entity';
import { DocStatus, DocVerification } from './users/entities/doc-verification.entity';
import { Location } from './users/entities/location.entity';
import { User } from './users/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'delivery_app',
  entities: [User, Delivery, Admin, Agency, Location, DocVerification],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  const hash = (pw: string) => bcrypt.hash(pw, 10);

  const userRepo = AppDataSource.getRepository(User);
  const deliveryRepo = AppDataSource.getRepository(Delivery);
  const adminRepo = AppDataSource.getRepository(Admin);
  const agencyRepo = AppDataSource.getRepository(Agency);
  const locationRepo = AppDataSource.getRepository(Location);
  const docRepo = AppDataSource.getRepository(DocVerification);

  // Clear existing seed data
  await AppDataSource.query('TRUNCATE TABLE doc_verifications, users, locations RESTART IDENTITY CASCADE');

  // 1. Admin (complete)
  const adminLoc = locationRepo.create({ text: 'Tunis Centre', lat: 36.8065, lng: 10.1815 });
  const savedAdminLoc = await locationRepo.save(adminLoc);
  const admin = adminRepo.create({
    username: 'admin_main',
    email: 'admin@delivtrack.com',
    password: await hash('Admin1234'),
    phone: '+21698765432',
    location: savedAdminLoc,
  });
  await adminRepo.save(admin);
  console.log('Created admin (complete)');

  // 2. Delivery - complete + approved
  const d1Loc = locationRepo.create({ text: 'Ariana', lat: 36.8625, lng: 10.1956 });
  const savedD1Loc = await locationRepo.save(d1Loc);
  const d1Doc = docRepo.create({
    cin: '12345678',
    cinImage: './uploads/documents/seed/cin-approved.jpg',
    licence: 'A-001122',
    licenceImage: './uploads/documents/seed/licence-approved.jpg',
    status: DocStatus.APPROVED,
    uploadedAt: new Date(),
    verifiedAt: new Date(),
  });
  const savedD1Doc = await docRepo.save(d1Doc);
  const delivery1 = deliveryRepo.create({
    username: 'driver_ali',
    email: 'ali@delivtrack.com',
    password: await hash('Driver123'),
    phone: '+21655001122',
    location: savedD1Loc,
    rate: 4.8,
    vehicleType: 'motorcycle',
    docVerification: savedD1Doc,
  });
  await deliveryRepo.save(delivery1);
  console.log('Created delivery (complete, approved)');

  // 3. Delivery - incomplete profile
  const delivery2 = deliveryRepo.create({
    username: 'driver_sami',
    email: 'sami@delivtrack.com',
    password: await hash('Driver123'),
    phone: '+21655003344',
  });
  await deliveryRepo.save(delivery2);
  console.log('Created delivery (incomplete)');

  // 4. Delivery - complete + pending
  const d3Loc = locationRepo.create({ text: 'Sousse', lat: 35.8256, lng: 10.6369 });
  const savedD3Loc = await locationRepo.save(d3Loc);
  const d3Doc = docRepo.create({
    cin: '87654321',
    cinImage: './uploads/documents/seed/cin-pending.jpg',
    licence: 'B-334455',
    licenceImage: './uploads/documents/seed/licence-pending.jpg',
    status: DocStatus.PENDING,
    uploadedAt: new Date(),
  });
  const savedD3Doc = await docRepo.save(d3Doc);
  const delivery3 = deliveryRepo.create({
    username: 'driver_nour',
    email: 'nour@delivtrack.com',
    password: await hash('Driver123'),
    phone: '+21655005566',
    location: savedD3Loc,
    rate: 4.2,
    vehicleType: 'car',
    docVerification: savedD3Doc,
  });
  await deliveryRepo.save(delivery3);
  console.log('Created delivery (complete, pending)');

  // 5. Delivery - complete + rejected
  const d4Loc = locationRepo.create({ text: 'Sfax', lat: 34.7406, lng: 10.7603 });
  const savedD4Loc = await locationRepo.save(d4Loc);
  const d4Doc = docRepo.create({
    cin: '11223344',
    cinImage: './uploads/documents/seed/cin-rejected.jpg',
    licence: 'C-667788',
    licenceImage: './uploads/documents/seed/licence-rejected.jpg',
    status: DocStatus.REJECTED,
    uploadedAt: new Date(),
    verifiedAt: new Date(),
  });
  const savedD4Doc = await docRepo.save(d4Doc);
  const delivery4 = deliveryRepo.create({
    username: 'driver_malek',
    email: 'malek@delivtrack.com',
    password: await hash('Driver123'),
    phone: '+21655007788',
    location: savedD4Loc,
    rate: 3.9,
    vehicleType: 'bicycle',
    docVerification: savedD4Doc,
  });
  await deliveryRepo.save(delivery4);
  console.log('Created delivery (complete, rejected)');

  // 6. Agency (complete)
  const agencyLoc = locationRepo.create({ text: 'La Marsa', lat: 36.8778, lng: 10.3248 });
  const savedAgencyLoc = await locationRepo.save(agencyLoc);
  const agency = agencyRepo.create({
    username: 'agency_express',
    email: 'agency@delivtrack.com',
    password: await hash('Agency123'),
    phone: '+21671001122',
    location: savedAgencyLoc,
  });
  await agencyRepo.save(agency);
  console.log('Created agency (complete)');

  console.log('\nSeed completed successfully!');
  console.log('\nCredentials:');
  console.log('  Admin:          admin@delivtrack.com / Admin1234');
  console.log('  Driver (ok):    ali@delivtrack.com   / Driver123');
  console.log('  Driver (new):   sami@delivtrack.com  / Driver123');
  console.log('  Driver (pend):  nour@delivtrack.com  / Driver123');
  console.log('  Driver (rej):   malek@delivtrack.com / Driver123');
  console.log('  Agency:         agency@delivtrack.com / Agency123');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
