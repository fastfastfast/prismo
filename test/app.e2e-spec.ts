import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/get-encrypt-data (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/get-encrypt-data')
            .send({ payload: 'test payload' })
            .expect(200);

        expect(response.body.successful).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.data1).toBeDefined();
        expect(response.body.data.data2).toBeDefined();
    });

    it('/get-decrypt-data (POST)', async () => {
        // First setup encryption
        const payload = 'secret message';
        const encryptRes = await request(app.getHttpServer())
            .post('/get-encrypt-data')
            .send({ payload });

        const { data1, data2 } = encryptRes.body.data;

        // Then decrypt
        const response = await request(app.getHttpServer())
            .post('/get-decrypt-data')
            .send({ data1, data2 })
            .expect(200);

        expect(response.body.successful).toBe(true);
        expect(response.body.data.payload).toBe(payload);
    });

    it('Validation error (POST)', async () => {
        // Missing payload
        await request(app.getHttpServer())
            .post('/get-encrypt-data')
            .send({})
            .expect(400);
    });
});
