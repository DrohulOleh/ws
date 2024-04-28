import { Component, OnDestroy, OnInit } from '@angular/core';
import { EUserRoles, IOrder, IUser } from '../../shared/classes/types';
import { AuthService } from '../../shared/services/auth.service';
import {
  BadgeModule,
  ButtonModule,
  FormModule,
  ModalModule,
  SpinnerModule,
  TableModule,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    SpinnerModule,
    ButtonModule,
    ModalModule,
    BadgeModule,
    IconModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users-page.component.html',
})
export class UsersPageComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  users: IUser[] = [];
  usersWithOrders: any[] = [];
  selectedUser!: any | undefined;
  selectedRole!: any | undefined;
  userRoles: EUserRoles[] = Object.values(EUserRoles);

  modalDetailedViewVISIBLE = false;
  modalChangeRoleVISIBLE = false;
  checkedAgreement = false;
  radioChecked = false;

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

  calculateOrderItems(order: IOrder) {
    return order.list?.reduce((acc, item) => {
      return (acc += item.quantity || 0);
    }, 0);
  }

  detailedView(userId: string) {
    this.selectedUser = this.usersWithOrders.find(
      (user) => user._id === userId
    );
    if (this.selectedUser) {
      //console.log(this.selectedUser);
      this.toggleModalDetailedView();
    }
  }

  changeRole() {
    this.checkedAgreement = false;
    this.toggleModalChangeRole();
  }

  onCheckAgreement() {
    this.checkedAgreement = !this.checkedAgreement;
  }

  onCheckRole(value: any) {
    console.log(value);
    this.selectedRole = value;
    return value;
  }

  onSubmitChangeRole(userId: string) {
    console.log(userId, this.selectedRole);

    this.userSubscription = this.authService.getUserById(userId).subscribe({
      next: (user) => {
        if (user) {
          console.log(this.selectedRole);
          user.role = this.selectedRole ? this.selectedRole : user.role;
          this.authService.updateUser(user).subscribe();
          this.ngOnInit();
          this.toggleModalChangeRole();
          this.toggleModalDetailedView();
        }
      },
      error: (err) => {
        console.log(err);
        this.toggleModalChangeRole();
      },
    });
  }

  toggleModalDetailedView() {
    this.modalDetailedViewVISIBLE = !this.modalDetailedViewVISIBLE;
  }

  toggleModalChangeRole() {
    this.modalChangeRoleVISIBLE = !this.modalChangeRoleVISIBLE;
  }
}
