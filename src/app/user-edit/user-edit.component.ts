import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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

  today: string = new Date().toISOString().split('T')[0];

  saveUser(form: NgForm) {
    if (form.valid) {
      this.save.emit(this.user);
    } else {
      console.log("Form is invalid");
    }
  }

  cancel() {
    this.cancelEdit.emit();
  }
}
