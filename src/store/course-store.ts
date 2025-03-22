import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export type BlockType = 
  // Text blocks
  | 'text-paragraph'
  | 'text-paragraph-heading'
  | 'text-paragraph-subheading'
  | 'text-heading'
  | 'text-subheading'
  // Layout blocks
  | 'layout-2-columns'
  | 'layout-3-columns'
  | 'layout-2-columns-25-75'
  | 'layout-2-columns-75-25'
  | 'layout-3-columns-25-50-25'
  | 'layout-table'
  // Statement blocks
  | 'statement-a'
  | 'statement-b'
  | 'statement-c'
  | 'statement-d'
  | 'statement-note'
  // Quote blocks
  | 'quote-a'
  | 'quote-b'
  | 'quote-c'
  | 'quote-d'
  | 'quote-on-image'
  | 'quote-carousel'
  // List blocks
  | 'list-numbered'
  | 'list-checkbox'
  | 'list-bulleted'
  // Image blocks
  | 'image-centered'
  | 'image-full-width'
  | 'image-text'
  | 'text-on-image'
  // Gallery blocks
  | 'gallery-carousel'
  | 'gallery-2-columns'
  | 'gallery-3-columns'
  | 'gallery-4-columns'
  // Multimedia blocks
  | 'multimedia-audio'
  | 'multimedia-video'
  | 'multimedia-embed'
  | 'multimedia-attachment'
  | 'multimedia-code'
  // Interactive blocks
  | 'interactive-accordion'
  | 'interactive-tabs'
  | 'interactive-labeled-graphic'
  | 'interactive-process'
  | 'interactive-scenario'
  | 'interactive-sorting'
  | 'interactive-timeline'
  | 'interactive-flashcard-grid'
  | 'interactive-flashcard-stack'
  | 'interactive-button'
  | 'interactive-button-stack'
  | 'interactive-storyline'
  // Knowledge check blocks
  | 'knowledge-multiple-response'
  | 'knowledge-multiple-choice'
  | 'knowledge-fill-blank'
  | 'knowledge-matching'
  | 'knowledge-question-bank'
  // Chart blocks
  | 'chart-bar'
  | 'chart-line'
  | 'chart-pie'
  // Divider blocks
  | 'divider-continue'
  | 'divider-line'
  | 'divider-numbered'
  | 'divider-spacer'
  // Template blocks
  | 'template-custom';

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  position?: number;
  isVisible?: boolean;
}

interface HistoryState {
  past: Block[][];
  present: Block[];
  future: Block[][];
}

interface CourseState {
  history: HistoryState;
  selectedBlockId: string | null;
  addBlock: (type: BlockType) => string;
  removeBlock: (id: string) => void;
  updateBlockContent: (id: string, content: Record<string, any>) => void;
  moveBlock: (id: string, position: number) => void;
  selectBlock: (id: string | null) => void;
  toggleBlockVisibility: (id: string) => void;
  getDefaultContent: (type: BlockType) => Record<string, any>;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY = 10;

export const useCourseStore = create<CourseState>((set, get) => ({
  history: {
    past: [],
    present: [],
    future: []
  },
  selectedBlockId: null,

  addBlock: (type) => {
    const id = uuidv4();
    const newBlock: Block = {
      id,
      type,
      content: get().getDefaultContent(type),
      position: get().history.present.length,
      isVisible: true
    };
    
    set((state) => {
      const newPresent = [...state.history.present, newBlock];
      return {
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), state.history.present],
          present: newPresent,
          future: []
        },
        selectedBlockId: newBlock.id
      };
    });

    return id;
  },

  removeBlock: (id) => {
    set((state) => {
      const newPresent = state.history.present.filter(block => block.id !== id);
      return {
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), state.history.present],
          present: newPresent,
          future: []
        },
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
      };
    });
  },

  updateBlockContent: (id, content) => {
    set((state) => {
      const newPresent = state.history.present.map(block => 
        block.id === id ? { ...block, content: { ...block.content, ...content } } : block
      );
      return {
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), state.history.present],
          present: newPresent,
          future: []
        }
      };
    });
  },

  moveBlock: (id, position) => {
    set((state) => {
      const blockIndex = state.history.present.findIndex(block => block.id === id);
      if (blockIndex === -1) return state;
      
      const updatedBlocks = [...state.history.present];
      const [movedBlock] = updatedBlocks.splice(blockIndex, 1);
      updatedBlocks.splice(position, 0, movedBlock);
      
      const newPresent = updatedBlocks.map((block, index) => ({ ...block, position: index }));
      
      return {
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), state.history.present],
          present: newPresent,
          future: []
        }
      };
    });
  },

  selectBlock: (id) => {
    set({ selectedBlockId: id });
  },

  toggleBlockVisibility: (id) => {
    set((state) => {
      const newPresent = state.history.present.map(block =>
        block.id === id ? { ...block, isVisible: !block.isVisible } : block
      );
      return {
        history: {
          past: [...state.history.past.slice(-MAX_HISTORY + 1), state.history.present],
          present: newPresent,
          future: []
        }
      };
    });
  },

  undo: () => {
    set((state) => {
      const { past, present, future } = state.history;
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        history: {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      };
    });
  },

  redo: () => {
    set((state) => {
      const { past, present, future } = state.history;
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        history: {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      };
    });
  },

  canUndo: () => {
    return get().history.past.length > 0;
  },

  canRedo: () => {
    return get().history.future.length > 0;
  },

  getDefaultContent: (type) => {
    switch (type) {
      // Text blocks
      case 'text-paragraph':
      case 'text-paragraph-heading':
      case 'text-paragraph-subheading':
      case 'text-heading':
      case 'text-subheading':
        return {
          text: 'Enter your text here',
          align: 'left'
        };

      // Layout blocks
      case 'layout-2-columns':
        return {
          columns: [
            { width: 50, content: [] },
            { width: 50, content: [] }
          ]
        };
      case 'layout-3-columns':
        return {
          columns: [
            { width: 33, content: [] },
            { width: 33, content: [] },
            { width: 33, content: [] }
          ]
        };
      case 'layout-2-columns-25-75':
        return {
          columns: [
            { width: 25, content: [] },
            { width: 75, content: [] }
          ]
        };
      case 'layout-2-columns-75-25':
        return {
          columns: [
            { width: 75, content: [] },
            { width: 25, content: [] }
          ]
        };
      case 'layout-3-columns-25-50-25':
        return {
          columns: [
            { width: 25, content: [] },
            { width: 50, content: [] },
            { width: 25, content: [] }
          ]
        };
      case 'layout-table':
        return {
          rows: 3,
          columns: 3,
          headers: true,
          data: Array(3).fill(Array(3).fill(''))
        };

      // Statement blocks
      case 'statement-a':
      case 'statement-b':
      case 'statement-c':
      case 'statement-d':
      case 'statement-note':
        return {
          text: 'Enter your statement here',
          icon: type === 'statement-note' ? 'info' : 'alert'
        };

      // Quote blocks
      case 'quote-a':
      case 'quote-b':
      case 'quote-c':
      case 'quote-d':
        return {
          text: 'Enter your quote here',
          author: 'Author name',
          role: 'Role or title'
        };
      case 'quote-on-image':
        return {
          text: 'Enter your quote here',
          author: 'Author name',
          role: 'Role or title',
          image: 'https://via.placeholder.com/1200x600',
          overlay: true,
          overlayOpacity: 0.5
        };
      case 'quote-carousel':
        return {
          quotes: [
            {
              text: 'Enter your quote here',
              author: 'Author name',
              role: 'Role or title'
            }
          ],
          autoplay: false,
          interval: 5000
        };

      // List blocks
      case 'list-numbered':
      case 'list-checkbox':
      case 'list-bulleted':
        return {
          items: ['First item', 'Second item', 'Third item'],
          startNumber: type === 'list-numbered' ? 1 : undefined
        };

      // Image blocks
      case 'image-centered':
        return {
          src: 'https://via.placeholder.com/800x400',
          alt: 'Placeholder image',
          caption: 'Image caption',
          width: 80
        };
      case 'image-full-width':
        return {
          src: 'https://via.placeholder.com/1200x600',
          alt: 'Placeholder image',
          caption: 'Image caption'
        };
      case 'image-text':
        return {
          src: 'https://via.placeholder.com/600x400',
          alt: 'Placeholder image',
          text: 'Enter your text here',
          imagePosition: 'left'
        };
      case 'text-on-image':
        return {
          src: 'https://via.placeholder.com/1200x600',
          alt: 'Placeholder image',
          text: 'Enter your text here',
          overlay: true,
          overlayOpacity: 0.5
        };

      // Gallery blocks
      case 'gallery-carousel':
        return {
          images: [
            {
              src: 'https://via.placeholder.com/800x400',
              alt: 'Placeholder image',
              caption: 'Image caption'
            }
          ],
          autoplay: false,
          interval: 5000,
          showCaptions: true,
          showIndicators: true
        };
      case 'gallery-2-columns':
      case 'gallery-3-columns':
      case 'gallery-4-columns':
        return {
          images: [
            {
              src: 'https://via.placeholder.com/400x400',
              alt: 'Placeholder image',
              caption: 'Image caption'
            }
          ],
          showCaptions: true,
          columns: parseInt(type.split('-')[1])
        };

      // Multimedia blocks
      case 'multimedia-audio':
        return {
          src: '',
          title: 'Audio title',
          autoplay: false,
          controls: true
        };
      case 'multimedia-video':
        return {
          src: '',
          title: 'Video title',
          autoplay: false,
          controls: true,
          poster: 'https://via.placeholder.com/1200x600'
        };
      case 'multimedia-embed':
        return {
          code: '',
          title: 'Embed title',
          width: '100%',
          height: '400px'
        };
      case 'multimedia-attachment':
        return {
          src: '',
          title: 'Attachment title',
          size: '0 KB',
          type: 'application/pdf'
        };
      case 'multimedia-code':
        return {
          code: '// Enter your code here',
          language: 'javascript',
          showLineNumbers: true
        };

      // Interactive blocks
      case 'interactive-accordion':
        return {
          items: [
            {
              title: 'Accordion item 1',
              content: 'Enter content here'
            }
          ],
          multiExpand: false
        };
      case 'interactive-tabs':
        return {
          tabs: [
            {
              title: 'Tab 1',
              content: 'Enter content here'
            }
          ]
        };
      case 'interactive-labeled-graphic':
        return {
          image: 'https://via.placeholder.com/800x600',
          hotspots: [
            {
              x: 50,
              y: 50,
              label: 'Hotspot 1',
              description: 'Enter description here'
            }
          ]
        };
      case 'interactive-process':
        return {
          steps: [
            {
              title: 'Step 1',
              description: 'Enter description here'
            }
          ],
          layout: 'horizontal'
        };
      case 'interactive-scenario':
        return {
          scenes: [
            {
              title: 'Scene 1',
              content: 'Enter content here',
              choices: [
                {
                  text: 'Choice 1',
                  nextScene: 'scene2'
                }
              ]
            }
          ]
        };
      case 'interactive-sorting':
        return {
          items: [
            {
              id: '1',
              text: 'Item 1',
              category: 'Category 1'
            }
          ],
          categories: ['Category 1']
        };
      case 'interactive-timeline':
        return {
          events: [
            {
              date: '2024',
              title: 'Event 1',
              description: 'Enter description here'
            }
          ]
        };
      case 'interactive-flashcard-grid':
      case 'interactive-flashcard-stack':
        return {
          cards: [
            {
              front: 'Front text',
              back: 'Back text'
            }
          ],
          columns: type === 'interactive-flashcard-grid' ? 2 : undefined
        };
      case 'interactive-button':
        return {
          text: 'Button text',
          action: 'next',
          style: 'primary'
        };
      case 'interactive-button-stack':
        return {
          buttons: [
            {
              text: 'Button text',
              action: 'next',
              style: 'primary'
            }
          ],
          layout: 'vertical'
        };
      case 'interactive-storyline':
        return {
          src: '',
          width: '100%',
          height: '600px'
        };

      // Knowledge check blocks
      case 'knowledge-multiple-response':
      case 'knowledge-multiple-choice':
        return {
          question: 'Enter your question here',
          options: ['Option 1', 'Option 2', 'Option 3'],
          correctAnswers: type === 'knowledge-multiple-response' ? [0] : 0,
          feedback: {
            correct: 'Correct!',
            incorrect: 'Try again.'
          }
        };
      case 'knowledge-fill-blank':
        return {
          text: 'Enter your text with [blank] placeholders',
          answers: ['answer'],
          caseSensitive: false
        };
      case 'knowledge-matching':
        return {
          pairs: [
            {
              left: 'Left item 1',
              right: 'Right item 1'
            }
          ]
        };
      case 'knowledge-question-bank':
        return {
          questions: [],
          randomize: true,
          count: 5
        };

      // Chart blocks
      case 'chart-bar':
      case 'chart-line':
      case 'chart-pie':
        return {
          title: 'Chart title',
          data: {
            labels: ['Label 1', 'Label 2', 'Label 3'],
            values: [10, 20, 30]
          },
          options: {
            showLegend: true,
            showValues: true
          }
        };

      // Divider blocks
      case 'divider-continue':
        return {
          text: 'Continue',
          icon: 'arrow-down'
        };
      case 'divider-line':
        return {
          style: 'solid',
          width: '100%'
        };
      case 'divider-numbered':
        return {
          number: 1,
          text: 'Section'
        };
      case 'divider-spacer':
        return {
          height: 40
        };

      // Template blocks
      case 'template-custom':
        return {
          content: {}
        };

      default:
        return {};
    }
  }
})); 