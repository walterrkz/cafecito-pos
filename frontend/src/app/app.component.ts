import { Component } from '@angular/core';
import { ProductsComponent } from "./pages/products/products.component";

@Component({
  selector: 'app-root',
  imports: [ProductsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'frontend';
}
