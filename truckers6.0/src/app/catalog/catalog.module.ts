import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogCreateComponent } from './catalog-create/catalog-create.component';
import { CatalogListComponent } from './catalog-list/catalog-list.component';

@NgModule({
  declarations: [
      CatalogCreateComponent,
      CatalogListComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CatalogModule {}
