<script lang="ts" setup>
import JSZip from 'jszip';
import { Package } from "../utils/favicon/index";
import type { IconPackage } from '~/utils/favicon/package';
import { useDropzone, type FileRejectReason } from "vue3-dropzone";
import { saveAs } from 'file-saver';
import { toast } from 'vue-sonner'

interface PreviewItem {
  key: string;
  img: string
}
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let presult: IconPackage;

const preview = ref<PreviewItem[]>([])
const files = ref<File | null>(null)
const code = [
  '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
  '<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">',
  '<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">',
  '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
  '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
  '<link rel="icon" href="/favicon.ico">',
]

function highlightCode(line: string) {
  return line
    .replace(/<([^>]+)>/g, '<span style="color: #8a6343;">&lt;$1&gt;</span>')
    .replace(/href="([^"]+)"/g, 'href="<span style="color: #5890ad;">$1</span>"')
    .replace(/sizes="([^"]+)"/g, 'sizes="<span style="color: #5890ad;">$1</span>"')
    .replace(/type="([^"]+)"/g, 'type="<span style="color: #5890ad;">$1</span>"');
}

const handleFileChange = (acceptedFiles: any[], rejectReasons: FileRejectReason[]) => {

  if (rejectReasons && rejectReasons.length) {
    toast.error("File Error!", {
      // @ts-ignore
      description: rejectReasons[0].errors[0] ? rejectReasons[0].errors[0].message : 'Someting went wrong while choosing file.',
      action: {
        label: "Close",
        onClick: () => toast.dismiss("FILE_ERROR"),
      },
      id: "FILE_ERROR",
    })
    return;
  }

  if (acceptedFiles && acceptedFiles.length) {
    files.value = acceptedFiles[0];
  }

  if (files.value) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    const reader = new FileReader();
    // reader.onabort = () => console.log("file reading was aborted");
    // reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const image = new Image();
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
        showPreview(canvas);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(files.value);
  }
}

const { getRootProps, isDragActive, getInputProps, ...rest } = useDropzone({ onDrop: handleFileChange, accept: "image/jpeg, image/png", multiple: false });

const download = () => {
  presult = Package.generate(canvas);
  var zip = new JSZip();
  zip.file("apple-touch-icon.png", presult.png180.split(",")[1], {
    base64: true
  });
  zip.file("favicon-32x32.png", presult.png32.split(",")[1], {
    base64: true
  });

  zip.file("favicon-16x16.png", presult.png16.split(",")[1], {
    base64: true
  });

  zip.file("favicon.ico", presult.ico.split(",")[1], {
    base64: true
  });

  zip.file("android-chrome-192x192.png", presult.png192.split(",")[1], {
    base64: true
  });

  zip.file("android-chrome-512x512.png", presult.png512.split(",")[1], {
    base64: true
  });

  zip.file("index.html", code.join('\n'));

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `spiderweb.zip`);
    toast.info("Donwloading!", {
      description: "Please wait while you assets are being downloaded.",
      action: {
        label: "Close",
        onClick: () => toast.dismiss("DOWNLOAD_INFO"),
      },
      id: "DOWNLOAD_INFO",
    });
  });
};

const convertZip = () => {
  if (files && files.value) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    const reader = new FileReader();
    // reader.onabort = () => console.log("file reading was aborted");
    // reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const image = new Image();
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
        download();
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(files.value);
  } else {
    toast.error("Error!", {
      description: "Upload an image first!",
      action: {
        label: "Close",
        onClick: () => toast.dismiss("DOWNlOAD_BUTTON"),
      },
      id: "DOWNlOAD_BUTTON",
    })
  }
};

const showPreview = (canvas: HTMLCanvasElement) => {
  presult = Package.generate(canvas);
  // @ts-ignore
  preview.value = (Object.keys(presult).map(key => ({ key, img: presult[key] })));
};

const copyCode = async () => {
  await copyToClipboard(code.join('\n'))
}

</script>

<template>
  <header class="tw-flex tw-justify-between tw-items-center tw-py-5 tw-px-14 tw-shadow-md tw-shadow-black/10">
    <NuxtLink to="/">
      <img src="/logo.svg" alt="Spider web" class="tw-w-[149px]">
    </NuxtLink>
    <NuxtLink to="/"
      class="tw-h-[40px] tw-px-4 tw-text-center hover:tw-bg-gray-100 tw-transition-all tw-grid tw-items-center tw-rounded">
      Home</NuxtLink>
  </header>

  <main class="tw-p-14 tw-max-w-screen-2xl tw-mx-auto">
    <section class="tw-space-y-8">
      <h1 class="tw-text-3xl tw-font-semibold">Favicon Generator</h1>
      <p>
        Generate your favicon from an image by uploading your image below.
        Download your favicon to your website make better user experience and
        seo.
      </p>

      <div class="tw-p-4 tw-border tw-rounded tw-space-y-6">
        <h3 class="tw-text-[24px] tw-font-semibold">Converter</h3>
        <div>
          <div v-bind="getRootProps()"
            class="tw-border-4 tw-bg-pink-50/50 tw-cursor-pointer tw-rounded-lg tw-border-dashed tw-grid tw-items-center tw-p-[70px] tw-text-center tw-text-pretty">
            <input v-bind="getInputProps()" class="tw-hidden" />
            <p v-if="isDragActive">Drop the files here ...</p>
            <p v-else>Drag 'n' drop your files here, or click to select files.</p>
          </div>
        </div>
      </div>

      <div>
        <UiButton size="lg" :class="'tw-mx-auto'">Download</UiButton>
        <div class="tw-border tw-border-gray-400 tw-space-y-6 tw-rounded-md tw-p-5 tw-mt-16"
          v-if="preview && preview.length">
          <h3 class="tw-text-[24px] tw-font-semibold">Preview</h3>
          <div class="tw-flex tw-flex-wrap tw-items-end tw-gap-4">
            <div class="tw-flex tw-flex-col tw-items-center" v-for="(item, index) in preview">
              <img :src="item.img" alt="{{ item.key }}">
              <h5 class="tw-capitalize tw-text-gray-600">{{ item.key }}</h5>
            </div>
          </div>
        </div>
      </div>

      <div class="tw-border tw-border-gray-400 tw-space-y-6 tw-rounded-md tw-p-5 tw-mt-16">
        <h3 class="tw-text-[24px] tw-font-semibold">Preview</h3>
        <div class="tw-space-y-4">
          <p>First, use the download button to download the files listed below. Put the files in the root directory of
            your website.</p>
          <ul class="tw-list-disc tw-list-inside tw-pl-4">
            <li>android-chrome-512x512.png</li>
            <li>android-chrome-192x192.png</li>
            <li>apple-touch-icon.png</li>
            <li>favicon-32x32.png</li>
            <li>favicon-16x16.png</li>
            <li>favicon.ico</li>
            <!-- <li>site.webmanifest</li> -->
          </ul>
          <p>Next, copy the following link tags and paste them into thehead of your HTML.</p>

          <div class="tw-p-5 tw-border tw-shadow-sm tw-rounded tw-flex tw-flex-col tw-gap-2">
            <div v-for="(line, index) in code" :key="index" v-html="highlightCode(line)"></div>
          </div>

          <div class="tw-flex tw-items-center tw-gap-4">
            <UiButton @click="copyCode"
              class="tw-border tw-rounded tw-px-5 tw-py-1 tw-font-semibold hover:tw-bg-gray-100">
              Copy</UiButton>
            <UiButton @click="">Download</UiButton>
          </div>
        </div>
      </div>

      <div class="tw-border tw-border-gray-400 tw-space-y-6 tw-rounded-md tw-p-5 tw-mt-16">
        <div class="tw-flex tw-justify-between tw-items-center tw-pb-4 tw-border-b">
          <h3 class="tw-text-2xl tw-font-semibold">What is favicon?</h3>
        </div>
        <p>
          A favicon (/'fæv.iˌkɒn/; short for favorite icon), also known as a shortcut icon, website icon, tab icon, URL
          icon, or bookmark icon, is a file containing one or more small icons, associated with a particular website or
          web page. A web designer can create such an icon and upload it to a website (or web page) by several means, and
          graphical web browsers will then make use of it. Browsers that provide favicon support typically display a
          page's favicon in the browser's address bar (sometimes in the history as well) and next to the page's name in a
          list of bookmarks. Browsers that support a tabbed document interface typically show a page's favicon next to the
          page's title on the tab, and site-specific browsers use the favicon as a desktop icon.
        </p>
        <h3 class="tw-text-2xl tw-font-semibold tw-pb-4 tw-border-b">Do favicon affect user experience or SEO?</h3>
        <p>Yes</p>
      </div>
    </section>
  </main>

  <footer class="tw-bg-pink-50/50 tw-p-14 tw-flex tw-flex-col tw-text-center tw-gap-6">
    <Nuxt to="/" class="tw-border-b tw-border-gray-200 tw-w-full tw-flex tw-justify-center tw-pb-6">
      <img src="/logo.svg" alt="Spider web" class="tw-w-[192px]">
    </Nuxt>
    <p>
      Copyright © 2024 Spidernow All Rights Reserved.
    </p>
  </footer>
</template>

<style></style>