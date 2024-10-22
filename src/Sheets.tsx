import { createMemo, createSignal, For, ParentProps, Show } from "solid-js";
import { Button, Input, Modal, SimpleCard } from "./components/Cards";
import { Logo } from "./components/Logo";
import { downloadFile } from "./utils/download";
import { cleanString } from "./utils/string";
import { formatNumber } from "./utils/numbers";

export function Sheets() {
  const table = createSignal<string[][]>([]);
  const [tableRows, setTableRows] = createSignal(12);
  const [tableCells, setTableCells] = createSignal(10);

  function clear() {
    table[1]([]);
    const t: string[][] = [];
    for (let i = 0; i < tableRows(); i++) {
      const a = [];
      for (let j = 0; j < tableCells(); j++) {
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
        <div class="text-center border-r border-b border-slate-300 dark:border-neutral-700  flex items-center justify-center ">
          {props.children}
        </div>
      </>
    );
  }
  const clearConf = createSignal(false);
  const downloadAskName = createSignal(false);
  const fileName = createSignal("Untitled Table");
  const shouldClearOnDownload = createSignal(false);
  const selectedCell = createSignal<{ x: number; y: number }>();
  enum ColumnAction {
    Sum,
    Average,
  }
  function colAction(action: ColumnAction) {
    let final = 0;
    const selectedCellData = selectedCell[0]()!;
    const selectedColumnIndex = selectedCellData.x - 1;
    const selectedRowIndex = selectedCellData.y - 1;
    if (action === ColumnAction.Sum || action === ColumnAction.Average) {
      for (let i = 0; i < selectedRowIndex; i++) {
        const cellValue = cleanString(table[0]()[i][selectedColumnIndex]);
        const numberized = Number(cellValue);

        if (!isNaN(numberized)) {
          final += numberized;
        }
      }
    }
    if (action === ColumnAction.Average) {
      final /= selectedRowIndex;
    }

    let t = table[0]();
    t[selectedRowIndex][selectedColumnIndex] = formatNumber(final);
    clear();
    table[1](t);

    return formatNumber(final);
  }

  return (
    <>
      <div class="flex flex-col sm:flex-row w-full h-full">
        <SimpleCard class="w-full sm:min-w-72 sm:max-w-72 h-full !bg-neutral-300/60 border-neutral-400 dark:!bg-neutral-800/60 border-r dark:border-neutral-700 ">
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
        <div class="grow flex flex-col">
          <SimpleCard class="flex items-center !shadow-none !bg-neutral-200 dark:!bg-neutral-800 gap-2">
            <Show
              fallback={
                <>
                  {" "}
                  <div class="p-1 ml-auto">No cell selected.</div>
                </>
              }
              when={selectedCell[0]()}
            >
              <Button
                onClick={() => {
                  colAction(ColumnAction.Average);
                }}
                disabled={
                  (selectedCell[0]()?.y || 0) <=
                  2 /**Need at least 2 cells to sum */
                }
                isPrimary
              >
                Average
              </Button>
              <Button
                onClick={() => {
                  colAction(ColumnAction.Sum);
                }}
                disabled={
                  (selectedCell[0]()?.y || 0) <=
                  2 /**Need at least 2 cells to sum */
                }
              >
                Sum
              </Button>
              <Show
                when={
                  (selectedCell[0]()?.y || 0) >
                  2 /**Need at least 2 cells to sum */
                }
              >
                of all numeric cells from cell ({selectedCell[0]()!.x}, 1) to
                cell ({selectedCell[0]()!.x}, {selectedCell[0]()!.y - 1})
              </Show>
              <div class="ml-auto">
                Selected Cell: ({selectedCell[0]()!.x}, {selectedCell[0]()!.y})
              </div>
            </Show>
          </SimpleCard>
          <SimpleCard class="w-full !p-0 overflow-auto  grow">
            <div
              style={{
                "grid-template-columns": `repeat(${tableCells()}, minmax(0, 1fr))`,
                "grid-template-rows": `${tableRows()}`,
              }}
              class={`grid w-full h-fit min-h-full border border-l-0 border-slate-300 dark:border-neutral-700`}
            >
              <For each={table[0]()}>
                {(v, i) => {
                  return (
                    <>
                      <For each={v}>
                        {(c, j) => {
                          let a!: HTMLInputElement;
                          const isSelected = createMemo(
                            () =>
                              selectedCell[0]()?.x === j() + 1 &&
                              selectedCell[0]()?.y === i() + 1
                          );
                          const isTyping = createSignal(false);

                          return (
                            <Cell>
                              <div class="relative h-full">
                                <input
                                  onFocus={() => {
                                    selectedCell[1]({ x: j() + 1, y: i() + 1 });
                                    isTyping[1](true);
                                  }}
                                  onBlur={() => {
                                    isTyping[1](false);
                                  }}
                                  ref={a}
                                  class={`h-full border-b-2 border-transparent w-full p-2 appearance-none outline-none ${
                                    isSelected() ? " !border-red-700 z-10" : ""
                                  }  -outline-offset-1 transition-all`}
                                  value={c}
                                  onInput={(e) => {
                                    const t = table[0]();
                                    t[i()][j()] = e.target.value;
                                    table[1](t);
                                  }}
                                />
                                <Show when={isTyping[0]()}>
                                  <SimpleCard class="absolute hidden">
                                    suggestion
                                  </SimpleCard>
                                </Show>
                              </div>
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
          <SimpleCard class="flex items-center border-t dark:border-black border-neutral-400 bg-neutral-300 dark:!bg-neutral-800 gap-2">
            <Button
              onClick={() => {
                setTableRows((v) => ++v);
                const t = table[0]();
                t.push(",".repeat(tableCells() - 1).split(","));
                clear();
                table[1](t);
                window.scrollTo(0, 10000000000);
              }}
              class="py-1"
            >
              Add Row
            </Button>
            <Button
              onClick={() => {
                setTableCells((v) => ++v);
                let t = table[0]();
                t.forEach((r, i) => {
                  r.push("");
                  console.log(r);
                  t[i] = r;
                });
                clear();
                table[1](t);
                window.scrollTo(0, 10000000000);
              }}
              class="py-1"
            >
              Add Column
            </Button>
          </SimpleCard>
        </div>
      </div>
      <Show when={clearConf[0]()}>
        <Modal>
          <div class="p-3">
            <h1>Save your work before clearing the table?</h1>
            <p class="my-3">
              If you choose to save your work, the table will be downloaded as a
              CSV file before clearing.
            </p>
          </div>
          <div class="grid grid-cols-3 gap-2 p-3 bg-neutral-700/20">
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
          <div class="p-3">
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
          </div>
          <div class="grid grid-cols-2 gap-2 p-3 bg-neutral-700/20">
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
