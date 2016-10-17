	@Test
	public void postMessage()
	{
		driver.get("https://developertriage.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in our test user login info.
		email.sendKeys("mohz2009@hotmail.co.uk");
		pw.sendKeys("142536");

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #bots channel and wait for it to load.
		driver.get("https://developertriage.slack.com/messages/general/");
		wait.until(ExpectedConditions.titleContains("general"));

		// Type something
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("surprise motherfucker!");
		messageBot.sendKeys(Keys.RETURN);

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'surprise motherfucker!']"));
		assertNotNull(msg);
	}