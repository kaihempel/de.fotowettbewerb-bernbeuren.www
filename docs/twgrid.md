### Implement Subgrid Rows with Tailwind CSS `grid-rows-subgrid`

Source: https://tailwindcss.com/docs/grid-template-rows

Illustrates the use of the `grid-rows-subgrid` utility to make a nested grid item inherit its row tracks from its parent grid. This allows for complex grid layouts where nested elements align with the parent's grid structure.

```html
<div class="grid grid-flow-col grid-rows-4 gap-4">  <div>01</div>  <!-- ... -->  <div>05</div>  <div class="row-span-3 grid grid-rows-subgrid gap-4">    <div class="row-start-2">06</div>  </div>  <div>07</div>  <!-- ... -->  <div>10</div></div>
```

--------------------------------

### Create Grid Container with Tailwind CSS grid Utility (HTML)

Source: https://tailwindcss.com/docs/display

This code snippet shows how to use the `grid` utility to establish a block-level grid container. This enables powerful two-dimensional layouts, allowing precise control over rows, columns, and spacing for its child elements.

```html
<div class="grid grid-cols-3 grid-rows-3 gap-4">  <!-- ... --></div>
```

--------------------------------

### Define Grid Row Start and End with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-row

Illustrates the use of Tailwind CSS `row-start-<number>` and `row-end-<number>` utilities to position grid items by specifying their starting and ending grid lines. These can be combined with `row-span`.

```html
<div class="grid grid-flow-col grid-rows-3 gap-4">  <div class="row-span-2 row-start-2 ...">01</div>  <div class="row-span-2 row-end-3 ...">02</div>  <div class="row-start-1 row-end-4 ...">03</div></div>
```

--------------------------------

### Distribute rows with space between in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Use the `content-between` utility class to distribute rows in a grid container, placing equal space between each line. This example demonstrates a grid where the vertical space is evenly distributed between rows.

```html
<div class="grid h-56 grid-cols-3 content-between gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Apply Tailwind CSS gap utilities for basic grid spacing

Source: https://tailwindcss.com/docs/gap

Demonstrates how to use `gap-<number>` utilities, such as `gap-4`, to apply a consistent gap between both rows and columns in a grid layout. This creates a two-column grid with a uniform 4-unit spacing.

```html
<div class="grid grid-cols-2 gap-4">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Align Grid Items to Start in Tailwind CSS

Source: https://tailwindcss.com/docs/justify-items

Demonstrates how to use the `justify-items-start` utility to align grid items to the start of their inline axis within a grid layout.

```html
<div class="grid justify-items-start ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Distribute grid items with space-between using Tailwind CSS

Source: https://tailwindcss.com/docs/place-content

This HTML snippet shows how to use the `place-content-between` utility class in Tailwind CSS to distribute grid items with equal space between each row and column along both axes. It's applied to a two-column grid with a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-between gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Distribute rows with space around in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Apply the `content-around` utility class to distribute rows in a grid container, ensuring equal space around each line. This example shows a grid where vertical space is distributed around each row, including at the start and end.

```html
<div class="grid h-56 grid-cols-3 content-around gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Span Grid Columns with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-column

This example demonstrates how to use `col-span-<number>` utilities in Tailwind CSS to make an element span a specified number of columns within a grid layout. It showcases basic grid usage with elements spanning 2 or more columns.

```html
<div class="grid grid-cols-3 gap-4">
  <div class="...">01</div>
  <div class="...">02</div>
  <div class="...">03</div>
  <div class="col-span-2 ...">04</div>
  <div class="...">05</div>
  <div class="...">06</div>
  <div class="col-span-2 ...">07</div>
</div>
```

--------------------------------

### Distribute rows with space evenly in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Utilize the `content-evenly` utility class to distribute rows in a grid container, creating equal space around each item, and accounting for consistent spacing between items. This example illustrates a grid with uniform vertical spacing throughout.

```html
<div class="grid h-56 grid-cols-3 content-evenly gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Define Grid Columns with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-template-columns

This HTML snippet demonstrates how to use `grid-cols-<number>` utilities in Tailwind CSS to create a grid layout with a specified number of equally sized columns. For instance, `grid-cols-4` creates a 4-column grid, making it easy to structure content.

```html
<div class="grid grid-cols-4 gap-4">  <div>01</div>  <!-- ... -->  <div>09</div></div>
```

--------------------------------

### Implement Responsive Grid Layout with Tailwind CSS Breakpoints

Source: https://tailwindcss.com/docs/hover-focus-and-other-states

This example shows how to create a responsive grid layout using Tailwind CSS's responsive breakpoints (`md`, `lg`). It defines a 3-column grid for mobile, a 4-column grid for medium screens, and a 6-column grid for large screens, providing an adaptive layout across device sizes.

```html
<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">  <!-- ... --></div>
```

--------------------------------

### Apply Tailwind CSS `items-baseline-last` utility

Source: https://tailwindcss.com/docs/align-items

Uses the `items-baseline-last` utility to align grid items along the cross axis, ensuring all baselines align with the last baseline in the container. This is beneficial for aligning text content across varying height elements in a grid.

```html
<div class="grid grid-cols-[1fr_auto] items-baseline-last">  <div>    <img src="img/spencer-sharp.jpg" />    <h4>Spencer Sharp</h4>    <p>Working on the future of astronaut recruitment at Space Recruit.</p>  </div>  <p>spacerecruit.com</p></div>
```

--------------------------------

### Align grid item to end with Tailwind CSS place-self-end

Source: https://tailwindcss.com/docs/place-self

Demonstrates using `place-self-end` to align a grid item to the end of both the horizontal and vertical axes within its allocated grid space. The provided HTML code sets a div with the `place-self-end` class within a grid layout.

```html
<div class="grid grid-cols-3 gap-4 ...">  <div>01</div>  <div class="place-self-end ...">02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Define Arbitrary Grid Columns in Tailwind CSS

Source: https://tailwindcss.com/docs/styling-with-utility-classes

Illustrates how to create a custom grid layout with specific column widths using arbitrary values. This allows for complex and precise grid structures beyond standard utility classes.

```HTML
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)]">  <!-- ... --></div>
```

--------------------------------

### Create Inline Grid Container with Tailwind CSS inline-grid Utility (HTML)

Source: https://tailwindcss.com/docs/display

This example demonstrates the `inline-grid` utility, which creates an inline-level grid container. It allows grid layouts to be embedded directly within text or other inline content, flowing with the surrounding elements while maintaining grid-based organization for its children.

```html
<span class="inline-grid grid-cols-3 gap-4">  <span>01</span>  <span>02</span>  <span>03</span>  <span>04</span>  <span>05</span>  <span>06</span></span><span class="inline-grid grid-cols-3 gap-4">  <span>01</span>  <span>02</span>  <span>03</span>  <span>04</span>  <span>05</span>  <span>06</span></span>
```

--------------------------------

### Align rows to end in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Utilize the `content-end` utility class to pack rows against the end of the cross axis in a grid container. This example illustrates a grid layout with 5 div elements aligned to the bottom.

```html
<div class="grid h-56 grid-cols-3 content-end gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Distribute grid items evenly with Tailwind CSS place-content-evenly

Source: https://tailwindcss.com/docs/place-content

This HTML snippet shows how to use the `place-content-evenly` utility class in Tailwind CSS to distribute grid items with even spacing along both inline and block axes. It's applied to a two-column grid with a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-evenly gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Apply Responsive Grid Rows with Tailwind CSS `md:grid-rows-<number>`

Source: https://tailwindcss.com/docs/grid-template-rows

Illustrates how to make grid row definitions responsive using breakpoint prefixes like `md:`. This example changes the number of grid rows from 2 to 6 on medium screens and above, adapting the layout for different device sizes and optimizing for various viewports.

```html
<div class="grid grid-rows-2 md:grid-rows-6 ...">  <!-- ... --></div>
```

--------------------------------

### Apply justify-self-auto with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example demonstrates how to use the `justify-self-auto` utility to align a grid item based on the parent grid's `justify-items` property. It shows a div within a grid container that inherits alignment.

```HTML
<div class="grid justify-items-stretch ...">  <!-- ... -->  <div class="justify-self-auto ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Distribute grid items with space-around using Tailwind CSS

Source: https://tailwindcss.com/docs/place-content

This HTML snippet demonstrates how to use the `place-content-around` utility class in Tailwind CSS to distribute grid items with equal space around each row and column along both axes. It's applied to a two-column grid with a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-around gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Stretch grid item with Tailwind CSS place-self-stretch

Source: https://tailwindcss.com/docs/place-self

Illustrates how to use `place-self-stretch` to make a grid item stretch to fill all available space along both axes within its grid cell. This HTML snippet contains a div with `place-self-stretch` within a Tailwind CSS grid.

```html
<div class="grid grid-cols-3 gap-4 ...">  <div>01</div>  <div class="place-self-stretch ...">02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply justify-self-start with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example uses the `justify-self-start` utility to align a grid item to the beginning of its inline axis within a grid container, regardless of the parent grid's `justify-items` property.

```HTML
<div class="grid justify-items-stretch ...">  <!-- ... -->  <div class="justify-self-start ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Stretch grid items with Tailwind CSS place-content-stretch

Source: https://tailwindcss.com/docs/place-content

This HTML snippet demonstrates how to use the `place-content-stretch` utility class in Tailwind CSS to stretch grid items to fill their grid areas along both inline and block axes. It's applied to a two-column grid with a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-stretch gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Stretch Grid Items in Tailwind CSS

Source: https://tailwindcss.com/docs/justify-items

Demonstrates the `justify-items-stretch` utility to make grid items stretch to fill the available space along their inline axis.

```html
<div class="grid justify-items-stretch ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Set Grid Column Start and End Lines with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-column

This example illustrates the use of `col-start-<number>` and `col-end-<number>` utilities in Tailwind CSS to position grid items by their start and end lines. It also shows how these can be combined with `col-span-<number>` for more precise control.

```html
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-4 col-start-2 ...">01</div>
  <div class="col-start-1 col-end-3 ...">02</div>
  <div class="col-span-2 col-end-7 ...">03</div>
  <div class="col-start-1 col-end-7 ...">04</div>
</div>
```

--------------------------------

### Span Rows with Tailwind CSS `row-span` Utilities

Source: https://tailwindcss.com/docs/grid-row

Demonstrates how to use Tailwind CSS `row-span-<number>` utilities to make grid items span a specific number of rows within a flexbox grid layout.

```html
<div class="grid grid-flow-col grid-rows-3 gap-4">  <div class="row-span-3 ...">01</div>  <div class="col-span-2 ...">02</div>  <div class="col-span-2 row-span-2 ...">03</div></div>
```

--------------------------------

### Set independent row and column gaps in Tailwind CSS

Source: https://tailwindcss.com/docs/gap

Illustrates using `gap-x-<number>` and `gap-y-<number>` utilities, like `gap-x-8` and `gap-y-4`, to control horizontal and vertical spacing independently within a grid. This example sets distinct column and row gaps for a three-column grid.

```html
<div class="grid grid-cols-3 gap-x-8 gap-y-4">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply grid-auto-flow with row-dense in HTML

Source: https://tailwindcss.com/docs/grid-auto-flow

This example demonstrates how to use `grid-flow-row-dense` along with `grid-cols-3` and `grid-rows-3` classes to control the auto-placement algorithm in a grid layout. The `col-span-2` class is used to make some items span multiple columns within the grid.

```html
<div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 ...">  <div class="col-span-2">01</div>  <div class="col-span-2">02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Implement Responsive Grid Row Utilities with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-row

Explains how to make grid row utilities responsive by prefixing them with breakpoint variants like `md:` in Tailwind CSS. This applies the styling only at specific screen sizes and above.

```html
<div class="row-span-3 md:row-span-4 ...">  <!-- ... --></div>
```

--------------------------------

### Implement Subgrid with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-template-columns

This HTML example shows how to utilize the `grid-cols-subgrid` utility in Tailwind CSS to make a nested grid item adopt the column tracks of its parent grid. This allows for precise alignment within complex layouts, ensuring consistent spacing and structure across nested elements.

```html
<div class="grid grid-cols-4 gap-4">  <div>01</div>  <!-- ... -->  <div>05</div>  <div class="col-span-3 grid grid-cols-subgrid gap-4">    <div class="col-start-2">06</div>  </div></div>
```

--------------------------------

### Center rows in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Apply the `content-center` utility class to position rows in the center of the cross axis within a grid container. This example shows a grid with 5 div elements vertically centered.

```html
<div class="grid h-56 grid-cols-3 content-center gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Align Grid Items to End in Tailwind CSS

Source: https://tailwindcss.com/docs/justify-items

Shows how to align grid items to the end of their inline axis using `justify-items-end` and its `safe` variant. The `safe` variant provides fallback alignment when space is insufficient.

```html
<div class="grid grid-flow-col justify-items-end ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

```html
<div class="grid grid-flow-col justify-items-end-safe ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Set Grid Rows with Tailwind CSS `grid-rows-<number>`

Source: https://tailwindcss.com/docs/grid-template-rows

Demonstrates how to create a grid with a specified number of equally sized rows using Tailwind CSS utilities like `grid-rows-4` in an HTML structure. This utility applies `grid-template-rows: repeat(n, minmax(0, 1fr));`.

```html
<div class="grid grid-flow-col grid-rows-4 gap-4">  <div>01</div>  <!-- ... -->  <div>09</div></div>
```

--------------------------------

### Apply Custom Grid Column Values in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-column

This snippet demonstrates how to use arbitrary values with `col-[<value>]` utilities in Tailwind CSS to define a grid column size and location using any custom value, such as a fractional span. It provides flexibility beyond predefined classes.

```html
<div class="col-[16_/_span_16] ...">
  <!-- ... --></div>
```

--------------------------------

### Align rows to start in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Use the `content-start` utility class to pack rows against the start of the cross axis in a multi-row grid container. This example demonstrates a basic grid layout with 5 div elements aligned to the top.

```html
<div class="grid h-56 grid-cols-3 content-start gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Align grid items to end with Tailwind CSS place-content-end

Source: https://tailwindcss.com/docs/place-content

This HTML snippet demonstrates how to use the `place-content-end` utility class in Tailwind CSS to align grid items against the end of their container's inline and block axes. It's applied to a two-column grid with a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-end gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Align grid item to start with Tailwind CSS place-self-start

Source: https://tailwindcss.com/docs/place-self

Illustrates the application of `place-self-start` to align a grid item to the beginning on both the horizontal and vertical axes. The HTML structure includes a div with the `place-self-start` class within a defined grid container.

```html
<div class="grid grid-cols-3 gap-4 ...">  <div>01</div>  <div class="place-self-start ...">02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply basic grid-auto-rows utilities with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-auto-rows

Demonstrates how to use `auto-rows-min` and `auto-rows-max` classes to control the size of implicitly-created grid rows within a basic HTML grid layout.

```html
<div class="grid grid-flow-row auto-rows-max">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Align grid item with Tailwind CSS place-self-auto

Source: https://tailwindcss.com/docs/place-self

Demonstrates how to use the `place-self-auto` utility to align a grid item based on its container's `place-items` property. This HTML snippet shows a div with `place-self-auto` inside a three-column grid layout.

```html
<div class="grid grid-cols-3 gap-4 ...">  <div>01</div>  <div class="place-self-auto ...">02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply justify-self-end with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example illustrates the usage of the `justify-self-end` utility to align a grid item to the end of its inline axis within a grid container.

```HTML
<div class="grid justify-items-stretch ...">  <!-- ... -->  <div class="justify-self-end ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Apply Responsive Grid Column Utilities in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-column

This example demonstrates how to apply grid column utilities conditionally based on screen size using responsive prefixes like `md:`. The element spans 2 columns by default and 6 columns on medium screens and above, enabling adaptive layouts.

```html
<div class="col-span-2 md:col-span-6 ...">
  <!-- ... --></div>
```

--------------------------------

### Set Custom Grid Column Values with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-template-columns

This HTML snippet illustrates using the `grid-cols-[<value>]` syntax in Tailwind CSS to define grid columns with a completely custom CSS value. This provides flexibility for complex or non-standard grid track definitions, allowing for specific pixel or fractional widths.

```html
<div class="grid-cols-[200px_minmax(900px,_1fr)_100px] ...">  <!-- ... --></div>
```

--------------------------------

### Apply justify-self-end-safe with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example demonstrates the `justify-self-end-safe` utility, which aligns a grid item to the end, but falls back to start alignment if there's insufficient space. It shows a div within a grid container.

```HTML
<div class="grid justify-items-stretch ...">  <!-- ... -->  <div class="justify-self-end-safe ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Center grid item with Tailwind CSS place-self-center

Source: https://tailwindcss.com/docs/place-self

Shows how to apply the `place-self-center` utility to perfectly center a grid item on both axes within its cell. This HTML example places a div with `place-self-center` inside a Tailwind CSS grid layout.

```html
<div class="grid grid-cols-3 gap-4 ...">  <div>01</div>  <div class="place-self-center ...">02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Define Custom Grid Rows with Tailwind CSS `grid-rows-[value]`

Source: https://tailwindcss.com/docs/grid-template-rows

Shows how to specify custom `grid-template-rows` values directly using the `grid-rows-[<value>]` arbitrary value syntax. This allows for fine-grained control over row sizes with any valid CSS grid value, such as explicit pixel dimensions or `minmax` functions.

```html
<div class="grid-rows-[200px_minmax(900px,1fr)_100px] ...">  <!-- ... --></div>
```

--------------------------------

### Align grid items to start with Tailwind CSS place-content-start

Source: https://tailwindcss.com/docs/place-content

This HTML snippet illustrates the use of the `place-content-start` utility class in Tailwind CSS to align grid items against the start of their container's inline and block axes. It's applied to a two-column grid with a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-start gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Use CSS Variables for Grid Column in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-column

This example shows how to reference a CSS variable for grid column properties using the `col-(<custom-property>)` syntax in Tailwind CSS. This is a shorthand for `col-[var(<custom-property>)]`, allowing dynamic column configuration.

```html
<div class="col-(--my-columns) ...">
  <!-- ... --></div>
```

--------------------------------

### Apply CSS Variables to Grid Columns with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-template-columns

This HTML example demonstrates how to apply a CSS custom property (variable) to define grid columns using the `grid-cols-(<custom-property>)` syntax in Tailwind CSS. This allows for dynamic grid column definitions managed by CSS variables, promoting reusability and easier theme management.

```html
<div class="grid-cols-(--my-grid-cols) ...">  <!-- ... --></div>
```

--------------------------------

### Center grid items with Tailwind CSS place-content-center

Source: https://tailwindcss.com/docs/place-content

This HTML snippet demonstrates how to use the `place-content-center` utility class in Tailwind CSS to center grid items within their container along both inline and block axes. It applies to a grid layout with two columns and a fixed height.

```html
<div class="grid h-48 grid-cols-2 place-content-center gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Apply justify-between with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-content

Use the `justify-between` utility to distribute flex or grid items along the main axis, placing equal space *between* them. The first item is aligned to the start, and the last item is aligned to the end of the container.

```html
<div class="flex justify-between ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Apply justify-self-center-safe with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example demonstrates the `justify-self-center-safe` utility, which centers a grid item but falls back to start alignment if there's insufficient space. It shows a div within a grid container.

```HTML
<div class="grid justify-items-stretch ...">  <!-- ... -->  <div class="justify-self-center-safe ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Apply justify-around with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-content

Use the `justify-around` utility to distribute flex or grid items along the main axis with equal space *around* each item. This results in half the space at the ends of the container compared to the space between items.

```html
<div class="flex justify-around ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Apply grid-auto-columns with Tailwind CSS utility classes

Source: https://tailwindcss.com/docs/grid-auto-columns

This example demonstrates how to control the size of implicitly-created grid columns using predefined Tailwind CSS utility classes like `auto-cols-max` and `grid-flow-col` for basic layout configurations.

```html
<div class="grid auto-cols-max grid-flow-col">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Apply justify-evenly with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-content

Use the `justify-evenly` utility to distribute flex or grid items along the main axis such that the space between any two items, and the space before the first item and after the last item, is exactly equal. This provides a uniform distribution across the container.

```html
<div class="flex justify-evenly ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Apply CSS Variable for Grid Rows with Tailwind CSS `grid-rows-(custom-property)`

Source: https://tailwindcss.com/docs/grid-template-rows

Demonstrates how to use a CSS variable for `grid-template-rows` with the `grid-rows-(<custom-property>)` syntax. This is a shorthand for `grid-rows-[var(<custom-property>)]`, simplifying the use of dynamic row definitions and improving maintainability.

```html
<div class="grid-rows-(--my-grid-rows) ...">  <!-- ... --></div>
```

--------------------------------

### Apply justify-self-center with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example shows how to use the `justify-self-center` utility to align a grid item to the center of its inline axis within a grid container.

```HTML
<div class="grid justify-items-stretch ...">  <!-- ... -->  <div class="justify-self-center ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Implement Responsive Grid Columns with Tailwind CSS

Source: https://tailwindcss.com/docs/grid-template-columns

This HTML snippet shows how to apply responsive `grid-template-columns` utilities in Tailwind CSS using breakpoint variants like `md:`. This allows the grid layout to adapt to different screen sizes, such as changing from 1 column to 6 columns on medium screens and above, optimizing for various devices.

```html
<div class="grid grid-cols-1 md:grid-cols-6 ...">  <!-- ... --></div>
```

--------------------------------

### Center Grid Items in Tailwind CSS

Source: https://tailwindcss.com/docs/justify-items

Illustrates centering grid items along their inline axis using `justify-items-center` and its `safe` variant. The `safe` variant ensures items align to the start if centering isn't possible due to space constraints.

```html
<div class="grid grid-flow-col justify-items-center ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

```html
<div class="grid grid-flow-col justify-items-center-safe ...">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Apply Borders Between Child Elements (Tailwind CSS)

Source: https://tailwindcss.com/docs/border-width

Demonstrates how to use `divide-x` and `divide-y` utilities to add borders between child elements within a grid or flex container, creating visual separation.

```html
<div class="grid grid-cols-3 divide-x-4">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

--------------------------------

### Apply justify-self-stretch with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-self

This example uses the `justify-self-stretch` utility to make a grid item fill the entire width of its grid area along the inline axis, overriding default alignment.

```HTML
<div class="grid justify-items-start ...">  <!-- ... -->  <div class="justify-self-stretch ...">02</div>  <!-- ... --></div>
```

--------------------------------

### Align rows with normal behavior in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Apply the `content-normal` utility class to pack content items in their default position, as if no `align-content` value was explicitly set. This example shows the default vertical alignment of rows in a grid.

```html
<div class="grid h-56 grid-cols-3 content-normal gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Apply CSS Variables for Grid Rows in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-row

Demonstrates how to use CSS variables with Tailwind CSS `row-(<custom-property>)` syntax for dynamic grid row styling. This syntax automatically wraps the variable in `var()`.

```html
<div class="row-(--my-rows) ...">  <!-- ... --></div>
```

--------------------------------

### Stretch rows to fill space in Tailwind CSS Grid

Source: https://tailwindcss.com/docs/align-content

Use the `content-stretch` utility class to allow content items to fill the available space along the container’s cross axis in a grid. This example demonstrates rows expanding vertically to occupy all available space.

```html
<div class="grid h-56 grid-cols-3 content-stretch gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div></div>
```

--------------------------------

### Apply Custom Grid Row Values in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-row

Shows how to set a custom grid row value using arbitrary value syntax `row-[<value>]` in Tailwind CSS. This allows for precise control over row sizing and placement.

```html
<div class="row-[span_16_/_span_16] ...">  <!-- ... --></div>
```

--------------------------------

### Apply Tailwind CSS `items-baseline` utility

Source: https://tailwindcss.com/docs/align-items

Uses the `items-baseline` utility to align flex items such that their text baselines are aligned along the container's cross axis. This is particularly useful for text-heavy content to ensure consistent vertical alignment.

```html
<div class="flex items-baseline ...">  <div class="pt-2 pb-6">01</div>  <div class="pt-8 pb-12">02</div>  <div class="pt-12 pb-4">03</div></div>
```

--------------------------------

### Apply Tailwind CSS `items-end` utility

Source: https://tailwindcss.com/docs/align-items

Uses the `items-end` utility to align flex items to the end of the container's cross axis. This positions all items at the bottom of the flex container.

```html
<div class="flex items-end ...">  <div class="py-4">01</div>  <div class="py-12">02</div>  <div class="py-8">03</div></div>
```

--------------------------------

### Apply place-items-end in Tailwind CSS

Source: https://tailwindcss.com/docs/place-items

This HTML snippet illustrates the use of the `place-items-end` utility class in Tailwind CSS to position grid items at the end of their grid areas on both axes. It requires Tailwind CSS for proper rendering.

```html
<div class="grid h-56 grid-cols-3 place-items-end gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Use Inline Styles for Complex CSS Grid Arbitrary Values

Source: https://tailwindcss.com/docs/styling-with-utility-classes

This HTML snippet illustrates applying complex, arbitrary CSS values for `grid-template-columns`. It shows both Tailwind's arbitrary value syntax for class names and a direct inline style approach, useful for values that are difficult to express compactly as utility classes.

```html
<div class="grid-[2fr_max(0,var(--gutter-width))_calc(var(--gutter-width)+10px)]"><div style="grid-template-columns: 2fr max(0, var(--gutter-width)) calc(var(--gutter-width) + 10px)">  <!-- ... --></div>
```

--------------------------------

### Apply Tailwind CSS `items-stretch` utility

Source: https://tailwindcss.com/docs/align-items

Uses the `items-stretch` utility to make flex items stretch along the container's cross axis, filling the available space. This ensures all items have the same height as the tallest item.

```html
<div class="flex items-stretch ...">  <div class="py-4">01</div>  <div class="py-12">02</div>  <div class="py-8">03</div></div>
```

--------------------------------

### Apply place-items-stretch in Tailwind CSS

Source: https://tailwindcss.com/docs/place-items

This HTML snippet demonstrates the `place-items-stretch` utility class in Tailwind CSS, which stretches grid items to fill their grid areas on both axes. Tailwind CSS is required for this styling to take effect.

```html
<div class="grid h-56 grid-cols-3 place-items-stretch gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply place-items-start in Tailwind CSS

Source: https://tailwindcss.com/docs/place-items

This HTML snippet demonstrates how to use the `place-items-start` utility class in Tailwind CSS to position grid items at the start of their grid areas on both axes. It requires Tailwind CSS to be configured for styling.

```html
<div class="grid grid-cols-3 place-items-start gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply place-items-center in Tailwind CSS

Source: https://tailwindcss.com/docs/place-items

This HTML snippet shows how to use the `place-items-center` utility class in Tailwind CSS to center grid items within their grid areas on both axes. Proper styling depends on Tailwind CSS configuration.

```html
<div class="grid h-56 grid-cols-3 place-items-center gap-4 ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div>  <div>05</div>  <div>06</div></div>
```

--------------------------------

### Apply justify-end with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-content

Use the `justify-end` utility to align flex or grid items to the end of the container's main axis. This class sets `justify-content` to `flex-end`, positioning content to the right in a row-direction layout or bottom in a column-direction layout.

```html
<div class="flex justify-end ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>03</div></div>
```

--------------------------------

### Define custom grid-auto-columns values in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-auto-columns

This example shows how to use the `auto-cols-[<value>]` syntax to set a custom size for implicitly-created grid columns. It also illustrates the shorthand `auto-cols-(<custom-property>)` for CSS variables, which automatically adds the `var()` function.

```html
<div class="auto-cols-[minmax(0,2fr)] ...">  <!-- ... --></div>
```

```html
<div class="auto-cols-(--my-auto-cols) ...">  <!-- ... --></div>
```

--------------------------------

### Apply Tailwind CSS `items-center` utility

Source: https://tailwindcss.com/docs/align-items

Uses the `items-center` utility to align flex items along the center of the container's cross axis. This centers all items vertically within the flex container.

```html
<div class="flex items-center ...">  <div class="py-4">01</div>  <div class="py-12">02</div>  <div class="py-8">03</div></div>
```

--------------------------------

### Apply Tailwind CSS `items-start` utility

Source: https://tailwindcss.com/docs/align-items

Uses the `items-start` utility to align flex items to the beginning of the container's cross axis. This positions all items at the top of the flex container.

```html
<div class="flex items-start ...">  <div class="py-4">01</div>  <div class="py-12">02</div>  <div class="py-8">03</div></div>
```

--------------------------------

### Apply Arbitrary Tailwind CSS Variants with At-Rules

Source: https://tailwindcss.com/docs/hover-focus-and-other-states

This HTML snippet shows how to use at-rules like `@supports` within arbitrary Tailwind CSS variants. It makes a `div` element display as a `grid` only if the browser supports `display:grid`.

```html
<div class="flex [@supports(display:grid)]:grid">  <!-- ... --></div>
```

--------------------------------

### Order items first or last with Tailwind CSS

Source: https://tailwindcss.com/docs/order

Illustrates the use of `order-first` and `order-last` utilities to quickly position flex or grid items at the beginning or end of their container. These utilities provide a simple way to prioritize or de-prioritize items without complex numbering.

```html
<div class="flex justify-between ...">  <div class="order-last ...">01</div>  <div class="...">02</div>  <div class="order-first ...">03</div></div>
```

--------------------------------

### Apply negative order values with Tailwind CSS

Source: https://tailwindcss.com/docs/order

Shows how to create a negative order value for flex and grid items by prefixing the utility class with a dash, e.g., `-order-1`. This allows items to be ordered before others with a default or positive order value.

```html
<div class="-order-1">  <!-- ... --></div>
```

--------------------------------

### Control divider styles between elements using Tailwind CSS

Source: https://tailwindcss.com/docs/border-style

This example illustrates how to apply border styles between child elements using Tailwind CSS `divide-x` and `divide-dashed` utilities. It creates a dashed divider between items in a grid layout, defining the style for the space between siblings.

```html
<div class="grid grid-cols-3 divide-x-3 divide-dashed divide-indigo-500">
  <div>01</div>
  <div>02</div>
  <div>03</div></div>
```

--------------------------------

### Align Individual Flex/Grid Item to End with Tailwind CSS `self-end`

Source: https://tailwindcss.com/docs/align-self

This example illustrates the use of the `self-end` utility class in Tailwind CSS to align an individual flex or grid item to the end of its container's cross-axis. It overrides the container's `align-items` property, forcing the item to the end.

```html
<div class="flex items-stretch ...">  <div>01</div>  <div class="self-end ...">02</div>  <div>03</div></div>
```

--------------------------------

### Apply justify-end-safe with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-content

Use the `justify-end-safe` utility to align flex or grid items to the end of the container's main axis. Similar to `justify-center-safe`, if space is insufficient, items will align to the start of the container, preventing overflow.

```html
<div class="flex justify-end-safe ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>03</div></div>
```

--------------------------------

### Set explicit sort order with Tailwind CSS

Source: https://tailwindcss.com/docs/order

Demonstrates how to use `order-<number>` utilities like `order-1` to explicitly control the rendering order of flex and grid items, overriding their default document order. This is useful for precise layout adjustments.

```html
<div class="flex justify-between ...">  <div class="order-3 ...">01</div>  <div class="order-1 ...">02</div>  <div class="order-2 ...">03</div></div>
```

--------------------------------

### Apply responsive Tailwind CSS `align-items` utilities

Source: https://tailwindcss.com/docs/align-items

Demonstrates how to apply responsive `align-items` utilities using breakpoint variants like `md:` to change alignment based on screen size. This example uses `items-stretch` by default and switches to `items-center` for medium screens and above, providing adaptive layout control.

```html
<div class="flex items-stretch md:items-center ...">  <!-- ... --></div>
```

--------------------------------

### Define custom order values using Tailwind CSS arbitrary values

Source: https://tailwindcss.com/docs/order

Explains how to set a completely custom order value for flex and grid items using the `order-[<value>]` arbitrary value syntax. This provides maximum flexibility for dynamic or calculated order properties.

```html
<div class="order-[min(var(--total-items),10)] ...">  <!-- ... --></div>
```

--------------------------------

### Align Individual Grid Item to Last Baseline with Tailwind CSS `self-baseline-last`

Source: https://tailwindcss.com/docs/align-self

This example demonstrates the `self-baseline-last` utility class in Tailwind CSS, which aligns an item along the container's cross-axis such that its last baseline aligns with the last baseline in the container. This is useful for aligning text within varied content like user profiles, ensuring consistent visual alignment.

```html
<div class="grid grid-cols-[1fr_auto]">  <div>    <img src="img/spencer-sharp.jpg" />    <h4>Spencer Sharp</h4>    <p class="self-baseline-last">Working on the future of astronaut recruitment at Space Recruit.</p>  </div>  <p class="self-baseline-last">spacerecruit.com</p></div>
```

--------------------------------

### Apply justify-center with Tailwind CSS

Source: https://tailwindcss.com/docs/justify-content

Use the `justify-center` utility to horizontally center flex or grid items along the main axis of their container. This class applies `justify-content: center;` to distribute space evenly around the items, centering them as a group.

```html
<div class="flex justify-center ...">  <div>01</div>  <div>02</div>  <div>03</div>  <div>04</div></div>
```

--------------------------------

### Migrate to Flexbox/Grid with `gap` for Spacing in Tailwind CSS v4

Source: https://tailwindcss.com/docs/upgrade-guide

If the v4 `space-x/y` selector changes cause issues, Tailwind CSS recommends migrating to a flex or grid layout and using the `gap` property for spacing. This approach offers a robust and performant way to manage spacing between elements.

```html
<div class="space-y-4 p-4">
  <div class="flex flex-col gap-4 p-4">
    <label for="name">Name</label>
    <input type="text" name="name" />
  </div>
</div>
```