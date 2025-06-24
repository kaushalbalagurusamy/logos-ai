"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import type { AnalyticsFolder } from "@/lib/types"

interface AnalyticsFolderTreeProps {
  folders: AnalyticsFolder[]
  onFolderSelect: (folderId: string) => void
  onFolderCreate: (name: string, parentId?: string) => void
  onFolderRename: (folderId: string, newName: string) => void
  onFolderDelete: (folderId: string) => void
  selectedFolderId?: string
}

interface FolderNodeProps {
  folder: AnalyticsFolder
  level: number
  isSelected: boolean
  isExpanded: boolean
  onToggle: () => void
  onSelect: () => void
  onRename: (newName: string) => void
  onDelete: () => void
  onCreateChild: (name: string) => void
  children: AnalyticsFolder[]
}

function FolderNode({
  folder,
  level,
  isSelected,
  isExpanded,
  onToggle,
  onSelect,
  onRename,
  onDelete,
  onCreateChild,
  children,
}: FolderNodeProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      onRename(newName.trim())
    }
    setIsRenaming(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename()
    } else if (e.key === "Escape") {
      setNewName(folder.name)
      setIsRenaming(false)
    }
  }

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-[#2a2d2e] ${
              isSelected ? "bg-[#094771] text-white" : "text-[#cccccc]"
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={onSelect}
          >
            <GripVertical className="w-3 h-3 text-[#858585] opacity-0 group-hover:opacity-100" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              className="p-0.5 hover:bg-[#3e3e42] rounded"
            >
              {children.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-[#dcb67a]" />
            ) : (
              <Folder className="w-4 h-4 text-[#dcb67a]" />
            )}
            {isRenaming ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                className="h-6 text-sm bg-[#3c3c3c] border-[#3e3e42]"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm truncate">{folder.name}</span>
            )}
            <span className="text-xs text-[#858585] ml-auto">{folder.analytics.length}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-[#3c3c3c] border-[#3e3e42]">
          <ContextMenuItem onClick={() => onCreateChild("New Folder")} className="text-[#cccccc] hover:bg-[#094771]">
            <Plus className="w-4 h-4 mr-2" />
            New Subfolder
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsRenaming(true)} className="text-[#cccccc] hover:bg-[#094771]">
            <Edit className="w-4 h-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={onDelete} className="text-red-400 hover:bg-red-900/20">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded &&
        children.map((child) => (
          <FolderTreeNode
            key={child.id}
            folder={child}
            level={level + 1}
            folders={[]} // Will be populated by parent
            selectedFolderId=""
            onFolderSelect={() => {}}
            onFolderCreate={() => {}}
            onFolderRename={() => {}}
            onFolderDelete={() => {}}
          />
        ))}
    </div>
  )
}

function FolderTreeNode({
  folder,
  level,
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderCreate,
  onFolderRename,
  onFolderDelete,
}: {
  folder: AnalyticsFolder
  level: number
  folders: AnalyticsFolder[]
  selectedFolderId?: string
  onFolderSelect: (folderId: string) => void
  onFolderCreate: (name: string, parentId?: string) => void
  onFolderRename: (folderId: string, newName: string) => void
  onFolderDelete: (folderId: string) => void
}) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const children = folders.filter((f) => f.parentId === folder.id)
  const isExpanded = expandedFolders.has(folder.id)
  const isSelected = selectedFolderId === folder.id

  const toggleExpanded = () => {
    const newExpanded = new Set(expandedFolders)
    if (isExpanded) {
      newExpanded.delete(folder.id)
    } else {
      newExpanded.add(folder.id)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <FolderNode
      folder={folder}
      level={level}
      isSelected={isSelected}
      isExpanded={isExpanded}
      onToggle={toggleExpanded}
      onSelect={() => onFolderSelect(folder.id)}
      onRename={(newName) => onFolderRename(folder.id, newName)}
      onDelete={() => onFolderDelete(folder.id)}
      onCreateChild={(name) => onFolderCreate(name, folder.id)}
      children={children}
    />
  )
}

export default function AnalyticsFolderTree({
  folders,
  onFolderSelect,
  onFolderCreate,
  onFolderRename,
  onFolderDelete,
  selectedFolderId,
}: AnalyticsFolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const rootFolders = folders.filter((folder) => !folder.parentId)

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (expandedFolders.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <div className="h-full bg-[#252526] border-r border-[#3e3e42]">
      <div className="p-3 border-b border-[#3e3e42]">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onFolderCreate("New Folder")}
            size="sm"
            className="h-6 w-6 p-0 bg-[#0e639c] hover:bg-[#1177bb]"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {rootFolders.map((folder) => (
            <FolderTreeNode
              key={folder.id}
              folder={folder}
              level={0}
              folders={folders}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              onFolderCreate={onFolderCreate}
              onFolderRename={onFolderRename}
              onFolderDelete={onFolderDelete}
            />
          ))}
          {rootFolders.length === 0 && (
            <div className="text-center py-8 text-[#858585]">
              <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No folders yet</p>
              <Button
                onClick={() => onFolderCreate("My First Folder")}
                size="sm"
                className="mt-2 bg-[#0e639c] hover:bg-[#1177bb]"
              >
                Create Folder
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
