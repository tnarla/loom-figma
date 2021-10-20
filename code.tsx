const { widget, ui } = figma;
const {
  AutoLayout,
  Text: WidgetText,
  useEffect,
  useSyncedState,
  Image: WidgetImage,
  SVG,
  Frame,
  useWidgetId,
} = widget;

interface OEmbedData {
  type: "video";
  html: string;
  title: string;
  height: number | null;
  width: number | null;
  provider_name: "Loom";
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  duration: number;
}

const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="102" height="102" viewBox="0 0 102 102" fill="none"><g filter="url(#filter0_d)"><rect x="15" y="11" width="72" height="72" rx="36" fill="white"/>
  <g opacity="0.6">
  <path d="M41 35.268V58.732C41 60.5212 43.0582 61.6083 44.6432 60.6344L63.9 48.9025C65.3667 48.0192 65.3667 45.9808 63.9 45.0749L44.6432 33.3656C43.0582 32.3917 41 33.4788 41 35.268Z" fill="#212121"/>
  </g>
  <rect x="12.5" y="8.5" width="77" height="77" rx="38.5" stroke="white" stroke-opacity="0.3" stroke-width="5"/>
  </g>
  <defs>
  <filter id="filter0_d" x="0" y="0" width="102" height="102" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
  <feOffset dy="4"/>
  <feGaussianBlur stdDeviation="5"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
  </filter>
  </defs>
  </svg>`;

function Widget() {
  const [oembedData, setOembedData] = useSyncedState<OEmbedData | null>(
    "oembedData",
    null
  );

  const widgetNode = figma.getNodeById(useWidgetId()) as WidgetNode;
  const iframe = {
    // adjust offsets for your widget
    x: widgetNode.x + 8,
    y: widgetNode.y - 32,
  };

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      if (message.type === "oembedData") {
        setOembedData(message.payload);

        figma.ui.close();
        figma.closePlugin();
      }
      if (message.type === "close") {
        figma.ui.close();
        figma.closePlugin();
      }
    };
  });


  return (
    <AutoLayout
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      padding={8}
      fill={oembedData ? "#615CF5" : "#FFFFFF"}
      cornerRadius={8}
      spacing={12}
      onClick={() =>
        new Promise<void>((resolve) => {
          figma.showUI(
            __html__,
            oembedData
              ? {
                  width: oembedData.width / 2,
                  height: oembedData.height / 2,
                  position: {
                    x: iframe.x,
                    y: iframe.y,
                  },
                }
              : { height: 150, width: 400 }
          );

          if (oembedData) {
            figma.ui.postMessage({
              type: "playEmbedUrl",
              payload: { ...oembedData },
            });
          } else {
            figma.ui.postMessage({ type: "addEmbedUrl" });
          }
        })
      }
    >
      {oembedData !== null ? (
        <AutoLayout>
          <Frame
            padding={4}
            // @ts-ignore
            fill={{ src: oembedData.thumbnail_url, type: "image" }}
            width={oembedData.thumbnail_width / 3}
            height={oembedData.thumbnail_height / 3}
          >
            <SVG
              src={playIcon}
              width={102}
              height={102}
              x={oembedData.thumbnail_width / 7.5}
              y={oembedData.thumbnail_height / 7.5}
            ></SVG>
          </Frame>
        </AutoLayout>
      ) : (
        <AutoLayout
          padding={20}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          fill="#615CF5"
          cornerRadius={8}
        >
          <SVG src='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 7.9991H12.7366L17.295 5.36732L16.2939 3.63294L11.7355 6.26472L14.3667 1.70668L12.6323 0.705033L10.0011 5.26307V0H7.99888V5.26358L5.36666 0.705033L3.63283 1.70618L6.26455 6.26422L1.70613 3.63294L0.705013 5.36681L5.26343 7.9986H0V10.0009H5.26293L0.705013 12.6327L1.70613 14.3671L6.26404 11.7358L3.63233 16.2938L5.36666 17.295L7.99838 12.7364V18H10.0006V12.7369L12.6318 17.295L14.3662 16.2938L11.7344 11.7353L16.2929 14.3671L17.294 12.6327L12.7361 10.0014H17.999V7.9991H18ZM9 11.7232C7.49026 11.7232 6.26656 10.4995 6.26656 8.98968C6.26656 7.4799 7.49026 6.25616 9 6.25616C10.5097 6.25616 11.7334 7.4799 11.7334 8.98968C11.7334 10.4995 10.5097 11.7232 9 11.7232Z" fill="#F7F7F8"/></svg>'></SVG>

          <WidgetText
            fontSize={18}
            horizontalAlignText="center"
            fill="#ffffff"
            fontWeight="bold"
            paragraphIndent={8}
          >
            Embed
          </WidgetText>
        </AutoLayout>
      )}
    </AutoLayout>
  );
}
widget.register(Widget);
