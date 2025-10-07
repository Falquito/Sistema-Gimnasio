import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsIn, IsNumber, IsString, Matches, registerDecorator, ValidationOptions,ValidationArguments } from "class-validator";
// 👉 Validador personalizado
export function IsAfter(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) return true; // no valida si falta uno de los campos

          const [h1, m1] = relatedValue.split(':').map(Number);
          const [h2, m2] = value.split(':').map(Number);
          const inicio = h1 * 60 + m1;
          const fin = h2 * 60 + m2;

          return fin > inicio;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `La hora de ${args.property} debe ser posterior a ${relatedPropertyName}`;
        },
      },
    });
  };
}


export class CreateProfesionaleDto {
    @ApiProperty()
    @IsString()
    nombre:string;
    @ApiProperty()
    @IsString()
    apellido:string;
    @ApiProperty()
    @IsString()
    telefono:string;
    @IsString()
    @IsIn(["M","F","X"])
    genero:string;
    @ApiProperty()
    @IsString()
    dni:string;
    @ApiProperty()
    @IsEmail()
    email:string;
    @ApiProperty()
    @IsString()
    contraseña:string;
    @IsIn(["Psicologia","Psicopedagogia","Psiqiuatria","Fonoaudiologia"])
    servicio:string;

    @IsArray()
    @Type(()=>ObraSocialDto)
    ObrasSociales:ObraSocialDto[]

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe tener el formato HH:mm (ejemplo: 09:00 o 21:30)',
  })
  hora_inicio_laboral: string;
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe tener el formato HH:mm (ejemplo: 09:00 o 21:30)',
  })
  @IsAfter('hora_inicio', {
    message: 'La hora de fin debe ser posterior a la hora de inicio',})
  hora_fin_laboral: string;
}

export class ObraSocialDto{
    @IsNumber()
    idObraSocial:number;
}