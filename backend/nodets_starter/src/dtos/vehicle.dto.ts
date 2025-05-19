import { IsString, IsOptional, Length, Matches } from "class-validator";

export class CreateVehicleDto {
    @IsString()
    @Matches(/^[A-Z0-9-]+$/, {
        message:
            "Plate must contain only uppercase letters, numbers, or hyphens",
    })
    @Length(5, 15, { message: "Plate must be between 5 and 15 characters" })
    plate: string;

    @IsString({ message: "Type is required" })
    type: string;

    @IsString({ message: "Color is required" })
    color: string;

    @IsOptional()
    @IsString({ message: "Model must be a string" })
    model?: string;
}
