// A fixed, fictional sample project used by the browser simulation.
// Nothing here is read from the visitor's computer.

export interface SampleFile {
  /** Path relative to the project root, Windows-style separators. */
  path: string;
  content: string;
}

export const PROJECT_ROOT = 'C:\\Users\\you\\projects\\demo-shop';

export const SAMPLE_FILES: readonly SampleFile[] = [
  {
    path: 'src\\Program.cs',
    content: `using DemoShop.Services;

var calculator = new PriceCalculator();

Console.WriteLine(calculator.Total(3, 19.90m));
`,
  },
  {
    path: 'src\\Models\\Order.cs',
    content: `namespace DemoShop.Models;

public record Order(int Id, decimal Amount);
`,
  },
  {
    path: 'src\\Services\\PriceCalculator.cs',
    content: `namespace DemoShop.Services;

public class PriceCalculator
{
    public decimal Total(int qty, decimal price) => qty * price;
}
`,
  },
  {
    path: 'tools\\Checksum.java',
    content: `public class Checksum {

    public static int of(String text) {
        return text.hashCode();
    }
}
`,
  },
  {
    path: 'scripts\\report.py',
    content: `import csv


def write_report(rows):
    with open("report.csv", "w") as f:
        csv.writer(f).writerows(rows)
`,
  },
  {
    path: 'web\\app.js',
    content: `const button = document.querySelector("#buy");

button.addEventListener("click", () => alert("Added!"));
`,
  },
  {
    path: 'web\\api.ts',
    content: `export async function getOrders(): Promise<unknown[]> {

  const res = await fetch("/api/orders");
  return res.json();
}
`,
  },
  {
    path: 'native\\vector.cpp',
    content: `#include <vector>

int sum(const std::vector<int>& v) {
    int s = 0;

    for (int x : v) s += x;
    return s;
}
`,
  },
  {
    path: 'cmd\\health.go',
    content: `package main

import "fmt"

func main() {
	fmt.Println("ok")
}
`,
  },
  {
    path: 'README.md',
    content: `# Demo Shop
`,
  },
  {
    path: 'notes.txt',
    content: `remember to update prices
`,
  },
  {
    path: 'bin\\Debug\\net9.0\\Generated.cs',
    content: `// build output
`,
  },
  {
    path: 'obj\\AssemblyInfo.cs',
    content: `// generated
`,
  },
];
