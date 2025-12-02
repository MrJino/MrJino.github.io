# WPF 하이브리드앱 만들기

![WPF Hybrid App](https://miro.medium.com/v2/resize:fit:1272/1*712Z8jstt_PJW90M7_151w.png)

## Nuget

윈도우즈 WPF 프로젝트에 웹 브라우징 엔진 (CefSharp) 을 추가 하려면 .NET 프레임워크를 위한 Package Manager인 Nuget (https://www.nuget.org/) 을 통해 설치를 하여야 합니다.

![Nuget](https://miro.medium.com/v2/resize:fit:1272/1*R7KZTiEdqVBYD2gMHQlY-w.png)

## CefSharp

CefSharp.Wpf 와 CefSharp.Wpf.NETCore 는 별도의 Dependency 로 구성되어 있어 둘 다 별도로 설치해 주어야 합니다.

![CefSharp Installation](https://miro.medium.com/v2/resize:fit:1400/1*cwk56k6ICWhKwzycWU85yw.png)

설치가 완료되면 프로젝트 Package 설정 영역에 아래와 같이 추가 됩니다.

```xml
<ItemGroup>
  <PackageReference Include="CefSharp.Wpf.NETCore" Version="117.2.40" />
  <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
</ItemGroup>
```

Web Page가 보여져야 하는 View (xaml)에 CefSharp 를 추가해 줍니다.

```xml
<Page xmlns:cefSharp="clr-namespace:CefSharp.Wpf;assembly=CefSharp.Wpf">
    <Grid>
        <cefSharp:ChromiumWebBrowser Grid.Row="0" Address="https://naver.com" />
    </Grid>
</Page>
```

## 결과

짜잔~~~ 아래와 같이 원하는 URL의 화면이 나오면 끝~

![Result](https://miro.medium.com/v2/resize:fit:1400/1*PYvDIxGj2tZXQT5d2oi4TA.png)

---

*작성일: 2023년 10월 11일*
