const { widget, ui } = figma;
const {
  AutoLayout,
  Text: WidgetText,
  useEffect,
  useSyncedState,
  Image: WidgetImage,
  SVG,
  Frame,
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

const playIcon =
  '<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#C4C4C4" fill-opacity="0.35"/><path d="M72 50.5L38.25 69.9856V31.0144L72 50.5Z" fill="black" fill-opacity="0.31"/></svg>';

function Widget() {
  const [oembedData, setOembedData] = useSyncedState<OEmbedData>(
    "oembedData",
    undefined
  );

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      console.log(message);
      if (message.type === "oembedData") {
        setOembedData(message.payload);
        
        figma.ui.close();
      }
      if (message.type === "close") {
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
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
      onClick={async () => {
        await new Promise<void>((resolve) => {
          figma.showUI(
            __html__,
            oembedData && {
              width: oembedData.width / 2,
              height: oembedData.height / 2,
            }
          );

          if (oembedData) {
            figma.ui.postMessage({
              type: "playEmbedUrl",
              payload: { ...oembedData },
            });
          } else {
            figma.ui.postMessage({ type: "addEmbedUrl" });
          }
        });
      }}
    >
      {oembedData ? (
        <AutoLayout>
          <Frame
            // @ts-ignore
            fill={{ src: oembedData.thumbnail_url, type: "image" }}
            width={oembedData.thumbnail_width / 2}
            height={oembedData.thumbnail_height / 2}
          >
            <SVG
              src={playIcon}
              width={74}
              height={74}
              x={oembedData.thumbnail_width / 4.5}
              y={oembedData.thumbnail_height / 4.5}
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
