import { Expose, Transform } from "class-transformer";

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    mile: number;

    @Expose()
    @Transform(({ obj }) => obj.user.id)
    userId: number;
}
