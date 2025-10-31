import { IsOptional, IsObject } from "class-validator"

export class CheckInDto {
  @IsOptional()
  @IsObject()
  geo?: { lat: number; lng: number }
}
