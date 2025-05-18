// slots.dto.ts
import {
    IsBoolean,
    IsOptional,
    IsString,
    Length,
    IsInt,
} from "class-validator";

export class CreateSlotDto {
    @IsString()
    @Length(1, 10)
    code: string;

    @IsOptional()
    @IsBoolean()
    occupied?: boolean;

    @IsOptional()
    @IsString()
    @Length(1, 60)
    description?: string; // <-- Make it optional with `?`
}

export class UpdateSlotDto {
    @IsOptional()
    @IsString()
    @Length(1, 10)
    code?: string;

    @IsOptional()
    @IsBoolean()
    occupied?: boolean;

    @IsString()
    @Length(1, 60)
    description: string;

    @IsOptional()
    @IsInt()
    assignedUserId?: number; // This can be handled differently if needed
}
