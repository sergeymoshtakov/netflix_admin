import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  @Input() user = { firstName: '', lastName: '', registrationDate: '' };
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancelEdit = new EventEmitter<void>();

  saveUser() {
    this.save.emit(this.user);
  }

  cancel() {
    this.cancelEdit.emit();
  }
}
