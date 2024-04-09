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
  ModalModule,
  ModalService,
  SpinnerModule,
  TableModule,
} from '@coreui/angular';
import { IOrder, IUser } from '../../shared/classes/types';
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
  currentUserIsAdmin = this.authService.isAdmin();
  selectedOrder!: IOrder;
  modalOrder = new ModalModule();

  orderSubscription!: Subscription;
  authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService
      .fetchUsers()
      .subscribe({ next: (users) => (this.users = users) });

    this.orderSubscription = this.orderService
      .fetchOrders()
      .subscribe({ next: (orders) => (this.orders = orders) });
  }

  ngAfterViewInit(): void {}

  selectOrder(order: IOrder) {
    this.selectedOrder = order;
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
}
