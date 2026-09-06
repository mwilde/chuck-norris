using Microsoft.AspNetCore.Components;

namespace ChuckNorris.Blazor.Demo.Components.Pages;

public partial class Home : ComponentBase
{
    private string _lastClicked = "never";

    private void OnButtonClicked() => _lastClicked = DateTime.Now.ToLongTimeString();
}
