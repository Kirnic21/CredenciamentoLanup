import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ConfirmationComponent } from './confirmation/confirmation.component.';

import { ResultComponent } from './result/result';
export const routes: Routes = [
    
{
    path:"",
    component:CadastroComponent
},
{
    path:"confirmation",
    component:ConfirmationComponent
},{
    path:"result",
    component:ResultComponent
}
];