import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateVisitDto {
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumber()
    @IsNotEmpty()
    points_awarded: number;

    @IsNotEmpty()
    placeId: string;

    @IsDateString()
    @IsNotEmpty()
    visit_date: string;
}