import { useCallback, useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
} from "lexical";
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $generateNodesFromDOM } from "@lexical/html";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Undo2,
  Redo2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Image as ImageIcon,
} from "lucide-react";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* toolbar */}
      <Toolbar />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Start typing ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <LinkPlugin />
        {/* editor plugins */}
      </div>
      {/* actions plugins */}
    </div>
  );
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const toggleLink = useCallback(() => {
    const url = window.prompt("URL du lien (laisser vide pour retirer)") || "";
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url === "" ? null : url);
  }, [editor]);

  const setHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    },
    [editor]
  );

  const setParagraph = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1"));
      }
    });
  }, [editor]);

  const setColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { color });
        }
      });
    },
    [editor]
  );

  const insertImage = useCallback(() => {
    const url = window.prompt("URL de l'image (JPEG/PNG/SVG)") || "";
    if (!url) return;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(
        `<img src="${url}" alt="" />`,
        "text/html"
      );
      const nodes = $generateNodesFromDOM(editor, dom);
      if (nodes && nodes.length > 0) {
        $insertNodes(nodes);
      }
    });
  }, [editor]);

  return (
    <div className="flex items-center gap-1 border-b bg-muted/30 px-2 py-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 className="h-4 w-4" />
      </Button>
      <div className="mx-1 h-5 w-px bg-border" />
      <div className="w-36">
        <Select
          onValueChange={(v) => {
            if (v === "paragraph") setParagraph();
            else if (v === "h1") setHeading(1);
            else if (v === "h2") setHeading(2);
            else if (v === "h3") setHeading(3);
          }}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Paragraphe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraphe</SelectItem>
            <SelectItem value="h1">Titre H1</SelectItem>
            <SelectItem value="h2">Titre H2</SelectItem>
            <SelectItem value="h3">Titre H3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mx-1 h-5 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={toggleLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>
      <div className="ml-2 flex items-center gap-2">
        <input
          type="color"
          className="h-6 w-6 cursor-pointer border rounded"
          onChange={(e) => setColor(e.target.value)}
          title="Couleur du texte"
        />
      </div>
      <div className="mx-1 h-5 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
      >
        <span className="text-xs">✕</span>
      </Button>
      <div className="mx-1 h-5 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <div className="mx-1 h-5 w-px bg-border" />
      <Button variant="ghost" size="sm" onClick={insertImage}>
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
