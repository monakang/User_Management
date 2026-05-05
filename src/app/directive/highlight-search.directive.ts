import { Directive } from '@angular/core';
import { Input } from '@angular/core';
import { ElementRef, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightSearch]',
})
export class HighlightSearchDirective implements OnChanges {
  @Input('appHighlightSearch') searchTerm: string = ''; // Input matches selector
  @Input() originalText: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    if (!this.searchTerm || !this.searchTerm.trim() || !this.originalText) {
      //to clear the highlight when search term is empty or original text is not provided
      this.renderer.setProperty(
        this.el.nativeElement,
        'textContent',
        this.originalText,
      );
      return;
    }
    this.highlight();
  }

  private highlight() {
    const search = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexp = new RegExp(search, 'gi'); //Global and case-insensitive search
    const newText = this.originalText.replace(
      regexp,
      (match) => `<mark>${match}</mark>`,
    );
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', newText);
  }
}
