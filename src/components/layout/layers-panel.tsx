import { useCourseStore, Block, BlockType } from "@/store/course-store"
import { Eye, EyeOff, Trash2, GripVertical } from "lucide-react"
import { Reorder } from "framer-motion"

export function LayersPanel() {
  const blocks = useCourseStore(state => state.history.present);
  const selectedBlockId = useCourseStore(state => state.selectedBlockId);
  const toggleBlockVisibility = useCourseStore(state => state.toggleBlockVisibility);
  const removeBlock = useCourseStore(state => state.removeBlock);
  const moveBlock = useCourseStore(state => state.moveBlock);
  const selectBlock = useCourseStore(state => state.selectBlock);

  return (
    <div className="space-y-4">
      <div className="font-medium">Course Structure</div>
      <Reorder.Group 
        axis="y" 
        values={blocks} 
        onReorder={(reorderedBlocks: Block[]) => {
          reorderedBlocks.forEach((block, index) => {
            moveBlock(block.id, index);
          });
        }}
        className="space-y-1"
      >
        {blocks.map((block: Block) => (
          <Reorder.Item
            key={block.id}
            value={block}
            className={`
              flex items-center justify-between
              px-3 py-2 rounded-lg
              ${selectedBlockId === block.id ? 'bg-gray-100' : 'hover:bg-gray-50'}
              ${block.isVisible ? '' : 'opacity-50'}
              cursor-pointer
              group
            `}
            onClick={() => selectBlock(block.id)}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-50 cursor-grab" />
              <span className="text-sm">
                {block.type.split('-').map((word: string) => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                className="p-1 hover:text-blue-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBlockVisibility(block.id);
                }}
              >
                {block.isVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <button
                className="p-1 hover:text-red-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  removeBlock(block.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
} 