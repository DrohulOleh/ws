import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { Subscription } from 'rxjs';
import {
  ButtonModule,
  ModalComponent,
  ModalModule,
  SpinnerModule,
  TableModule,
} from '@coreui/angular';
import { EUserRoles, IOrder, IUser } from '../../shared/classes/types';
import { IconModule } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    SpinnerModule,
    TableModule,
    IconModule,
    ModalModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './order-page.component.html',
})
export class OrderPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalOrder') modalRef!: ElementRef;

  orders: IOrder[] = [];
  users: IUser[] = [];
  loading = false;
  currentUserIsAdmin =
    this.authService.getUserPayload()?.role === EUserRoles.admin ? true : false;
  selectedOrder!: IOrder;
  // modalOrder!: ModalComponent;
  modalVisible = false;

  orderSubscription!: Subscription;
  authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.fetchUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
    });

    this.orderSubscription = this.orderService.fetchOrders().subscribe({
      next: (orders) => {
        this.orders = this.addEmailsToOrders(orders);
      },
    });

    console.log(this.currentUserIsAdmin);
  }

  ngAfterViewInit(): void {}

  selectOrder(order: IOrder) {
    this.selectedOrder = order;
    this.toggleModal();
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) this.orderSubscription.unsubscribe();
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  calculateAmount(order: IOrder) {
    return order.list?.reduce((acc, item) => {
      return (acc += (item.quantity || 0) * item.cost);
    }, 0);
  }

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }

  addEmailsToOrders(orders: IOrder[]): IOrder[] {
    return orders.map((order) => {
      const user = this.users.find((user) => user._id === order.user);
      if (user) {
        return { ...order, email: user.email }; // Создаем новый объект с добавленным email
      }
      return order;
    });
  }
}
