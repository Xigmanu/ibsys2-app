import { Component, OnInit } from '@angular/core';
import { DataService, Production } from '../data.service';
import {
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lotsize',
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    DragDropModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './lotsize.component.html',
  styleUrls: ['./lotsize.component.scss'],
})
export class LotsizeComponent implements OnInit {
  productionList: Production[] = [];
  isModalOpen = false;
  currentAction: 'split' | 'merge' | null = null;
  selectedIndex: number | null = null; // Changed from selectedProduction to selectedIndex
  modalTitle = '';
  modalMessage = '';
  splitQuantity = 1;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.productionList =
      this.dataService.getData().output.productionList.productions;
  }

  drop(event: CdkDragDrop<Production[]>) {
    moveItemInArray(
      this.productionList,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Opens the confirmation modal.
   * @param action The action to perform ('split' or 'merge').
   * @param index The index of the production item in the list.
   */
  openConfirmModal(action: 'split' | 'merge', index: number): void {
    this.currentAction = action;
    this.selectedIndex = index;
    this.modalTitle =
      action === 'split'
        ? 'lotsize.modal.splitTitle'
        : 'lotsize.modal.mergeTitle';
    this.modalMessage =
      action === 'split'
        ? 'lotsize.modal.splitMessage'
        : 'lotsize.modal.mergeMessage';
    this.isModalOpen = true;

    // If action is 'split', initialize splitQuantity based on the selected production
    if (action === 'split' && this.selectedIndex !== null) {
      const selectedProduction = this.getSelectedProduction();
      this.splitQuantity = selectedProduction
        ? Math.floor(selectedProduction.quantity / 2)
        : 1;
    }
  }

  /**
   * Closes the confirmation modal and resets related properties.
   */
  closeConfirmModal(): void {
    this.isModalOpen = false;
    this.currentAction = null;
    this.selectedIndex = null;
    this.splitQuantity = 1; // Reset split quantity
  }

  /**
   * Confirms the action (split or merge) and executes it.
   */
  confirmAction(): void {
    if (this.currentAction !== null && this.selectedIndex !== null) {
      if (this.currentAction === 'split') {
        this.splitProduct(this.selectedIndex);
      } else if (this.currentAction === 'merge') {
        this.mergeProduct(this.selectedIndex);
      }
    }
    this.closeConfirmModal();
  }

  /**
   * Splits the production at the given index into two productions.
   * @param index The index of the production to split.
   */
  splitProduct(index: number): void {
    this.dataService.splitProductionListArticle(index, this.splitQuantity);
    // Refresh the production list to reflect changes
    this.refreshProductionList();
  }

  /**
   * Merges the production at the given index with the next one.
   * @param index The index of the production to merge.
   */
  mergeProduct(index: number): void {
    this.dataService.mergeProductionListArticles(index);
    // Refresh the production list to reflect changes
    this.refreshProductionList();
  }

  /**
   * Retrieves the selected production based on the selectedIndex.
   * @returns The selected Production or null if not found.
   */
  getSelectedProduction(): Production | null {
    if (this.selectedIndex !== null) {
      return this.productionList[this.selectedIndex] || null;
    }
    return null;
  }

  /**
   * Determines the maximum split quantity based on the selected production's quantity.
   * @returns The maximum allowed split quantity.
   */
  getMaxSplitQuantity(): number {
    const selectedProduction = this.getSelectedProduction();
    return selectedProduction ? selectedProduction.quantity - 1 : 1;
  }

  /**
   * Refreshes the production list by fetching updated data from the DataService.
   */
  private refreshProductionList(): void {
    this.productionList =
      this.dataService.getData().output.productionList.productions;
  }

  /**
   * Determines if the merge button should be enabled for a given index.
   * @param index The index of the production item.
   * @returns True if merge is possible, otherwise false.
   */
  canMerge(index: number): boolean {
    const productions =
      this.dataService.getData().output.productionList.productions;
    if (index < 0 || index >= productions.length) {
      return false;
    }

    const currentArticle = productions[index].article;

    // Count how many times this article appears in the list
    const articleCount = productions.filter(
      (p) => p.article === currentArticle
    ).length;

    // Can merge if there's more than one instance of this article
    return articleCount > 1;
  }
}
