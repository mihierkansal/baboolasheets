import { createSignal, For, ParentProps, Show } from "solid-js";
import { Button, Input, Modal, SimpleCard } from "./components/Cards";
import { Logo } from "./components/Logo";
import { downloadFile } from "./utils/download";

export function Sheets() {
  const table = createSignal<string[][]>([]);
  const TABLE_ROWS = 12;
  const TABLE_CELLS = 10;

  function clear() {
    table[1]([]);
    const t: string[][] = [];
    for (let i = 0; i < TABLE_ROWS; i++) {
      const a = [];
      for (let j = 0; j < TABLE_CELLS; j++) {
        a.push("");
      }
      t.push(a);
    }
    table[1](t);
  }
  clear();
  function csvFromTable() {
    let csv = "";
    for (let i = 0; i < table[0]().length; i++) {
      let str = "";
      for (let j = 0; j < table[0]()[i].length; j++) {
        if (j > 0) {
          str += ",";
        }
        str += `"${table[0]()[i][j].split('"').join('""')}"`;
      }
      str += "\n";
      csv += str;
    }
    console.log(csv);
    return csv;
  }
  function updateTableWithCSV(
    existingTable: string[][],
    csv: string
  ): string[][] {
    const parsedCSV = parseCSV(csv);

    return existingTable.map((row, rowIndex) => {
      const csvRow = parsedCSV[rowIndex] || [];
      return csvRow.concat(row.slice(csvRow.length));
    });
  }
  function parseCSV(csv: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const nextChar = csv[i + 1];

      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++; // Skip the next character since it's already handled
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        currentRow.push(currentCell);
        currentCell = "";
      } else if (char === "\n" && !insideQuotes) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }

    // Add the last cell and row if there's no newline at the end
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell);
      rows.push(currentRow);
    }

    // Clean up any leading/trailing quotes
    for (let row of rows) {
      for (let i = 0; i < row.length; i++) {
        row[i] = row[i].replace(/^"|"$/g, "").replace(/""/g, '"');
      }
    }

    return rows;
  }

  function Cell(props: ParentProps) {
    return (
      <>
        {" "}
        <div class="text-center   outline outline-1 outline-slate-300 dark:outline-slate-700  flex items-center justify-center ">
          {props.children}
        </div>
      </>
    );
  }
  const clearConf = createSignal(false);
  const downloadAskName = createSignal(false);
  const fileName = createSignal("Untitled Table");
  const shouldClearOnDownload = createSignal(false);
  return (
    <>
      <div class="flex flex-col sm:flex-row w-full h-full gap-2">
        <SimpleCard class="w-full sm:min-w-72 sm:max-w-72 h-full">
          <Logo />
          <div class="flex flex-col gap-2 mt-5">
            <label for="ocsv" class="block w-full">
              <Button
                isPrimary
                class="w-full"
                onClick={() => {
                  (
                    document.querySelector("input#ocsv")! as HTMLInputElement
                  ).click();
                }}
              >
                Open CSV
              </Button>
            </label>
            <input
              hidden
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                      clear();
                      const content = event.target!.result;
                      table[1](
                        updateTableWithCSV(table[0](), content as string)
                      );
                    };
                    reader.readAsText(file);
                  }
                }
              }}
              id="ocsv"
            />
            <Button onClick={() => clearConf[1](true)}>Clear</Button>
            <Button
              onClick={() => {
                downloadAskName[1](true);
              }}
            >
              Export to CSV
            </Button>
          </div>
        </SimpleCard>
        <div class="grow">
          <SimpleCard class="w-full h-full p-0 overflow-hidden">
            <div class="grid w-full h-full grid-cols-10 grid-rows-12 rounded-lg border-2 border-slate-300 dark:border-slate-700">
              <For each={table[0]()}>
                {(v, i) => {
                  return (
                    <>
                      <For each={v}>
                        {(c, j) => {
                          return (
                            <Cell>
                              <input
                                class="h-full w-full p-2 appearance-none outline-none focus:outline-blue-700 outline-3 -outline-offset-1 transition-all focus:z-10"
                                value={c}
                                onInput={(e) => {
                                  const t = table[0]();
                                  t[i()][j()] = e.target.value;
                                  table[1](t);
                                }}
                              />
                            </Cell>
                          );
                        }}
                      </For>
                    </>
                  );
                }}
              </For>
            </div>
          </SimpleCard>
        </div>
      </div>
      <Show when={clearConf[0]()}>
        <Modal>
          <h1>Save your work before clearing the table?</h1>
          <p class="my-3">
            If you choose to save your work, the table will be downloaded as a
            CSV file before clearing.
          </p>
          <div class="grid grid-cols-3 gap-2">
            <Button
              class="justify-center"
              onClick={() => {
                shouldClearOnDownload[1](true);
                downloadAskName[1](true);
                clearConf[1](false);
              }}
              isPrimary
            >
              Save & Clear Table
            </Button>
            <Button
              class="justify-center"
              onClick={() => {
                clear();
                clearConf[1](false);
              }}
            >
              Clear Without Saving
            </Button>
            <Button
              class="justify-center"
              onClick={() => {
                clearConf[1](false);
              }}
            >
              Don't Clear
            </Button>
          </div>
        </Modal>
      </Show>
      <Show when={downloadAskName[0]()}>
        <Modal>
          <h1>What should we call your table?</h1>
          <p class="my-3">
            Enter the file name you want for the downloaded table in the box
            below.
          </p>
          <Input
            class="w-full"
            value={fileName[0]()}
            onInput={(e) => {
              fileName[1](e.target.value);
            }}
          />
          <div class="grid grid-cols-2 gap-2">
            <Button
              class="justify-center"
              onClick={() => {
                downloadFile(fileName[0]() + ".csv", csvFromTable());
                downloadAskName[1](false);
                if (shouldClearOnDownload[0]()) {
                  clear();
                }
                shouldClearOnDownload[1](false);
              }}
              isPrimary
            >
              Download
            </Button>
            <Button
              class="justify-center"
              onClick={() => {
                downloadAskName[1](false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </Show>
    </>
  );
}
