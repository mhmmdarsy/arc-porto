'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import type { TooltipProps } from 'recharts';

import { cn } from './utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground \
           [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 \
           [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border \
           [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border \
           [&_.recharts-radial-bar-background-sector]:fill-muted \
           [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted \
           flex aspect-video justify-center text-xs",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, c]) => c.theme || c.color,
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] || item.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipPayloadFromProps =
  TooltipProps<any, any> extends { payload?: infer P }
    ? P extends readonly (infer I)[]
      ? I
      : never
    : never;

type ChartTooltipPayload = {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: any;
  icon?: React.ComponentType;
};



function ChartTooltipContent({
  active,
  payload,
  className,
  hideIndicator = false,
  nameKey,
}: Omit<TooltipProps<any, any>, 'payload'> & {
  payload?: (ChartTooltipPayload & { graphicalItemId?: string })[];
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
} & React.ComponentProps<'div'>) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        'border-border/50 bg-background rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div key={key} className="flex items-center gap-2">
            {!hideIndicator && (
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-muted-foreground">
              {itemConfig?.label || item.name}
            </span>
            <span className="font-mono font-medium">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  payload,
}: React.ComponentProps<'div'> & {
  payload?: (ChartTooltipPayload & { graphicalItemId?: string })[];
}) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className={cn('flex gap-4', className)}>
      {payload.map((item) => {
        const key = `${item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || !payload) return undefined;
  return key in config ? config[key] : undefined;
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
