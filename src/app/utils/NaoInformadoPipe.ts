import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'naoInformado',
    standalone: true
})
export class NaoInformadoPipe implements PipeTransform {
    transform(value: any): string {
        if( !value || value=="" )
            return "----"
        return value;
    }
}
