import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOrder, IUser } from '../../shared/classes/types';
import { AuthService } from '../../shared/services/auth.service';
import { SpinnerModule, TableModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [TableModule, CommonModule, SpinnerModule],
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  users: IUser[] = [];
  usersWithOrders: any[] = [];

  userSubscription!: Subscription;
  orderSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderSubscription = this.orderService.fetchOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.userSubscription = this.authService.fetchUsers().subscribe({
          next: (users) => {
            this.usersWithOrders = users.map((user) => {
              // find orders for the current user
              const userOrders = this.orders.filter(
                (order) => order.user === user._id
              );
              // calculate the total number of orders and the amount of orders for the current user
              const totalOrders = userOrders.length;
              const totalAmount = userOrders.reduce((acc, order) => {
                if (order.list) {
                  const orderAmount = order.list.reduce((sum, item) => {
                    return sum + (item.quantity || 0) * item.cost;
                  }, 0);
                  return acc + orderAmount;
                } else {
                  return acc;
                }
              }, 0);
              // return an object with data about the user and his orders
              return { ...user, orders: userOrders, totalOrders, totalAmount };
            });

            console.log(this.usersWithOrders);
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) this.orderSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  calculateOrderAmount(order: IOrder) {
    return order.list?.reduce((acc, item) => {
      return (acc += (item.quantity || 0) * item.cost);
    }, 0);
  }

  changeRole(user: IUser) {}
}
