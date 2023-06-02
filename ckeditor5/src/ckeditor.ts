/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import {ClassicEditor} from '@ckeditor/ckeditor5-editor-classic';
import {Alignment} from '@ckeditor/ckeditor5-alignment';
import {Autoformat} from '@ckeditor/ckeditor5-autoformat';
import {AutoLink, Link} from '@ckeditor/ckeditor5-link';
import {BlockQuote} from '@ckeditor/ckeditor5-block-quote';
import {Bold, Code, Italic} from '@ckeditor/ckeditor5-basic-styles';
import {CKFinder} from '@ckeditor/ckeditor5-ckfinder';
import {UploadAdapter} from '@ckeditor/ckeditor5-adapter-ckfinder';
import {CodeBlock} from '@ckeditor/ckeditor5-code-block';
import {Essentials} from '@ckeditor/ckeditor5-essentials';
import {FindAndReplace} from '@ckeditor/ckeditor5-find-and-replace';
import {FontBackgroundColor,FontColor,FontFamily,FontSize} from '@ckeditor/ckeditor5-font';
import {Heading} from '@ckeditor/ckeditor5-heading';
import {Highlight} from '@ckeditor/ckeditor5-highlight';
import {HorizontalLine} from '@ckeditor/ckeditor5-horizontal-line';
import {Image, ImageCaption, ImageResize,ImageStyle, ImageToolbar, ImageUpload} from '@ckeditor/ckeditor5-image';
import {Indent, IndentBlock} from '@ckeditor/ckeditor5-indent';
import {List} from '@ckeditor/ckeditor5-list';
import {Markdown} from '@ckeditor/ckeditor5-markdown-gfm';
import {MediaEmbed} from '@ckeditor/ckeditor5-media-embed';
import {Paragraph} from '@ckeditor/ckeditor5-paragraph';
import {PasteFromOffice} from '@ckeditor/ckeditor5-paste-from-office';
import {Table, TableToolbar} from '@ckeditor/ckeditor5-table';
import {TextTransformation} from '@ckeditor/ckeditor5-typing';
import {SourceEditing} from "@ckeditor/ckeditor5-source-editing";
// import {Template} from "@ckeditor/ckeditor5-template";

export default class Editor extends ClassicEditor {
  // Plugins to include in the build.
  public static override builtinPlugins = [
    Alignment,
    Autoformat,
    AutoLink,
    BlockQuote,
    Bold,
    CKFinder,
    UploadAdapter,
    Code,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    HorizontalLine,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    Markdown,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    SourceEditing,
    // Template,
  ];
  // Editor configuration.
  public static override defaultConfig = {
    toolbar: {
      items: [
        'sourceEditing',
        'heading',
        'fontBackgroundColor',
        'fontColor',
        'fontFamily',
        'fontSize',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        'alignment',
        '|',
        'CKFinder',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
        'findAndReplace',
        'code',
        'codeBlock',
        // 'insertTemplate'
      ]
    },
    language: 'zh-cn',
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    }
  }
}
