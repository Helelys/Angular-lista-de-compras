import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Form } from "./components/form/form";
import { Price } from "./components/price/price";
import { List } from "./components/list/list";
import { ModalEdit } from "./components/modal-edit/modal-edit";
import { ModalPrice } from "./components/modal-price/modal-price";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Form, Price, List, ModalEdit, ModalPrice],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('01.Lista-de-compras');
}
