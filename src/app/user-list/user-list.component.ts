import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserComponent, CommonModule, UserEditComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users = [
    { firstName: 'Andrew', lastName: 'Stone', registrationDate: new Date().toISOString().split('T')[0] },
    { firstName: 'Marry', lastName: 'Smith', registrationDate: new Date().toISOString().split('T')[0] },
  ];

  currentUser: any = null;
  isEditorVisible = false;
  isEditMode = false;
  editingIndex: number | null = null;

  startAdding() {
    this.currentUser = { firstName: '', lastName: '', registrationDate: new Date().toISOString().split('T')[0] };
    this.isEditMode = false;
    this.isEditorVisible = true;
  }

  startEditing(user: any, index: number) {
    this.currentUser = { ...user };
    this.isEditMode = true;
    this.editingIndex = index;
    this.isEditorVisible = true;
  }

  saveUser(user: any) {
    if (this.isEditMode && this.editingIndex !== null) {
      this.users[this.editingIndex] = user;
    } else {
      this.users.push(user);
    }
    this.cancelEdit();
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
  }

  cancelEdit() {
    this.isEditorVisible = false;
    this.currentUser = null;
    this.editingIndex = null;
  }
}