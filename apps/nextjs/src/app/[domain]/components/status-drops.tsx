export function StatusDrops({
  data,
}: {
  data: { color: string; tooltip: string }[];
}) {
  return (
    <div className="mt-2 flex h-10 w-full items-center space-x-0.5">
      {data.map((item, index) => (
        <Drop key={index} content={item.tooltip} />
      ))}
    </div>
  );
}

export function Drop({ content }: { content: string }) {
  return (
    <div className="group relative flex h-full w-full rounded-xl bg-primary">
      <span
        className="-translate-x-100 absolute left-1/2 z-50 m-1 mx-auto translate-y-full whitespace-nowrap rounded-md 
    bg-popover p-2 text-sm text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
      >
        {content}
      </span>
    </div>
    // <TooltipEasy content={content}>

    // </TooltipEasy>
  );
}
