function drawBody() {
	var tailTip = [48/255, 39/255, 33/255, 1];
	var tailMid = [188/255, 144/255, 111/255, 1];
	var furColor = [156/255, 111/255, 62/255, 1];
	var insideEar = [180/255, 143/255, 135/255, 1];
	var darkerInsideEar = [140/255, 103/255, 95/255, 1];

	// Body
	var body1 = new Cube();
	body1.color = furColor;
	body1.matrix.translate(-0.025, -0.025, -0.0625/2);
	body1.matrix.rotate(45, 1, 0, 0);
	body1.matrix.rotate(g_wholeBodyAngle, 1, 0, 0);
	body1.matrix.translate(0, g_wholeBodyY, 0);

	var body1Mat = new Matrix4(body1.matrix);
	var body1MatCopy = new Matrix4(body1.matrix);
	body1.matrix.scale(0.05, 0.05, 0.0625);
	body1.render();

	var body2 = new Cube();
	body2.color = furColor;
	body2.matrix = body1Mat;
	body2.matrix.translate(-0.175/2+0.025, -0.075, -0.075);
	body2.matrix.rotate(0, 1, 0, 0);

	var body2Mat = new Matrix4(body2.matrix);
	body2.matrix.scale(0.175, 0.15, 0.1);
	body2.render();

	var body3 = new Cube();
	body3.color = furColor;
	body3.matrix = body2Mat;
	body3.matrix.translate(-0.0375, -0.075, -0.125);
	body3.matrix.rotate(-10, 1, 0, 0);

	var body3Mat = new Matrix4(body3.matrix);
	var body3MatW = new Matrix4(body3.matrix);
	var body3MatCopy1 = new Matrix4(body3.matrix);
	var body3MatCopy2 = new Matrix4(body3.matrix);
	body3.matrix.scale(0.25, 0.25, 0.2);
	body3.render();

	var textureBody = new Cube();
	textureBody.color = [235/255, 197/255, 188/255, 1];
	textureBody.matrix = body3MatW;
	textureBody.matrix.translate(-(0.175-0.25)/2, -0.001, 0.05+0.001);
	textureBody.matrix.scale(0.175, 0.15, 0.15);
	textureBody.render();

	var tempBody = new Cube();
	tempBody.color = furColor;
	tempBody.matrix = body3Mat;
	tempBody.matrix.translate(0.0125+0.225, 0.01, 0.05);
	tempBody.matrix.rotate(180, 0, 1, 0);
	tempBody.matrix.rotate(g_upperBodyAngle, 1, 0, 0);

	var tempBodyMat = new Matrix4(tempBody.matrix);
	tempBody.matrix.scale(0.225, 0.225, 0.2);
	tempBody.render();

	var body4 = new Cube();
	body4.color = furColor;
	body4.matrix = tempBodyMat;
	body4.matrix.rotate(180, 0, 1, 0);
	body4.matrix.translate(-0.225, 0, -0.2);

	var body4Mat = new Matrix4(body4.matrix);
	var body4MatCopy1 = new Matrix4(body4.matrix);
	var body4MatCopy2 = new Matrix4(body4.matrix);
	body4.matrix.scale(0.225, 0.225, 0.2);
	body4.render();

	// Tail
	var tail1 = new Cube();
	tail1.color = tailMid;
	tail1.matrix = body1MatCopy;
	tail1.matrix.translate(-0.0125+0.025, 0.015, 0.0);
	tail1.matrix.rotate(-g_tail1XAngle, 1, 0, 0);
	tail1.matrix.rotate(-g_tail1YAngle, 0, 1, 0);
	tail1.matrix.rotate(g_tail1ZAngle, 0, 0, 1);

	var tail1Mat = new Matrix4(tail1.matrix);
	tail1.matrix.scale(0.025, 0.025, 0.125);
	tail1.render();

	var tail2 = new Cube()
	tail2.color = tailMid;
	tail2.matrix = tail1Mat;
	tail2.matrix.translate(0, 0, 0.125);
	tail2.matrix.rotate(-g_tail2XAngle, 1, 0, 0);
	tail2.matrix.rotate(-g_tail2YAngle, 0, 1, 0);
	tail2.matrix.rotate(g_tail2ZAngle, 0, 0, 1);

	var tail2Mat = new Matrix4(tail2.matrix);
	tail2.matrix.scale(0.025, 0.025, 0.125);
	tail2.render();

	var tail3 = new Cube()
	tail3.color = tailMid;
	tail3.matrix = tail2Mat;
	tail3.matrix.translate(0, 0, 0.125);
	tail3.matrix.rotate(-g_tail3XAngle, 1, 0, 0);
	tail3.matrix.rotate(-g_tail3YAngle, 0, 1, 0);
	tail3.matrix.rotate(g_tail3ZAngle, 0, 0, 1);

	var tail3Mat = new Matrix4(tail3.matrix);
	tail3.matrix.scale(0.025, 0.025, 0.125);
	tail3.render();

	var tail4 = new Cube()
	tail4.color = tailMid;
	tail4.matrix = tail3Mat;
	tail4.matrix.translate(0, 0, 0.125);
	tail4.matrix.rotate(-g_tail4XAngle, 1, 0, 0);
	tail4.matrix.rotate(-g_tail4YAngle, 0, 1, 0);
	tail4.matrix.rotate(g_tail4ZAngle, 0, 0, 1);

	var tail4Mat = new Matrix4(tail4.matrix);
	tail4.matrix.scale(0.025, 0.025, 0.125);
	tail4.render();

	var tail5 = new Cube();
	tail5.color = tailMid;
	tail5.matrix = tail4Mat;
	tail5.matrix.translate(0, 0, 0.125);
	tail5.matrix.rotate(-g_tail5XAngle, 1, 0, 0);
	tail5.matrix.rotate(-g_tail5YAngle, 0, 1, 0);
	tail5.matrix.rotate(g_tail5ZAngle, 0, 0, 1);

	var tail5Mat = new Matrix4(tail5.matrix);
	tail5.matrix.scale(0.025, 0.025, 0.125);
	tail5.render();

	var tail6 = new Cube();
	tail6.color = tailMid;
	tail6.matrix = tail5Mat;
	tail6.matrix.translate(0, 0, 0.125);
	tail6.matrix.rotate(-g_tail6XAngle, 1, 0, 0);
	tail6.matrix.rotate(-g_tail6YAngle, 0, 1, 0);
	tail6.matrix.rotate(g_tail6ZAngle, 0, 0, 1);

	var tail6Mat = new Matrix4(tail6.matrix);
	tail6.matrix.scale(0.025, 0.025, 0.125);
	tail6.render();

	var tail7 = new Cube();
	tail7.color = tailMid;
	tail7.matrix = tail6Mat;
	tail7.matrix.translate(0, 0, 0.125);
	tail7.matrix.rotate(-g_tail7XAngle, 1, 0, 0);
	tail7.matrix.rotate(-g_tail7YAngle, 0, 1, 0);
	tail7.matrix.rotate(g_tail7ZAngle, 0, 0, 1);

	var tail7Mat = new Matrix4(tail7.matrix);
	tail7.matrix.scale(0.025, 0.025, 0.125);
	tail7.render();

	var tail8 = new Cube();
	tail8.color = tailMid;
	tail8.matrix = tail7Mat;
	tail8.matrix.translate(0, 0, 0.125);
	tail8.matrix.rotate(-g_tail8XAngle, 1, 0, 0);
	tail8.matrix.rotate(-g_tail8YAngle, 0, 1, 0);
	tail8.matrix.rotate(g_tail8ZAngle, 0, 0, 1);

	var tail8Mat = new Matrix4(tail8.matrix);
	tail8.matrix.scale(0.025, 0.025, 0.125);
	tail8.render();

	var tail9 = new Cube();
	tail9.color = [98/255, 83/255, 65/255, 1];
	tail9.matrix = tail8Mat;
	tail9.matrix.translate(0, 0.001, 0.125);
	tail9.matrix.rotate(-g_tail9XAngle, 1, 0, 0);
	tail9.matrix.rotate(-g_tail9YAngle, 0, 1, 0);
	tail9.matrix.rotate(g_tail9ZAngle, 0, 0, 1);

	var tail9Mat = new Matrix4(tail9.matrix);
	tail9.matrix.scale(0.025, 0.025, 0.125);
	tail9.render();

	var tail10 = new Prism();
	tail10.color = tailTip;
	tail10.matrix = tail9Mat;
	tail10.matrix.translate(-0.0225, 0.01125, 0.125);
	tail10.matrix.rotate(-g_tail10XAngle, 1, 0, 0);
	tail10.matrix.rotate(-g_tail10YAngle, 0, 1, 0);
	tail10.matrix.rotate(g_tail10ZAngle, 0, 0, 1);

	var tail10Mat = new Matrix4(tail10.matrix);
	tail10.matrix.scale(0.07, 0.05, 0.3);
	tail10.render();

	var tail11 = new Prism();
	tail11.color = tailTip;
	tail11.matrix = tail10Mat;
	tail11.matrix.translate(0.07, 0, 0);
	tail11.matrix.rotate(180, 0, 0, 1);
	tail11.matrix.scale(0.07, 0.05, 0.3);
	tail11.render();

	// Head
	var head1 = new Cube();
	head1.color = furColor;
	head1.matrix = body4Mat;
	head1.matrix.rotate(g_headAngle, 1, 0, 0);
	head1.matrix.translate(-0.0025, -0.005, 0);
	
	var head1Mat = new Matrix4(head1.matrix);
	var headEar1 = new Matrix4(head1.matrix);
	var headEar2 = new Matrix4(head1.matrix);
	head1.matrix.scale(0.23, 0.23, 0.06);
	head1.render();

	var head2 = new Cube();
	head2.color = furColor;
	head2.matrix = head1Mat;
	head2.matrix.translate(0.015, 0, -0.025);

	var head2Mat = new Matrix4(head2.matrix);
	head2.matrix.scale(0.2, 0.22, 0.025);
	head2.render();

	var head3 = new Cube();
	head3.color = furColor;
	head3.matrix = head2Mat;
	head3.matrix.translate(0.015, 0, -0.025);

	var head3Mat = new Matrix4(head3.matrix);
	var head3MatCopy = new Matrix4(head3.matrix);
	head3.matrix.scale(0.17, 0.21, 0.025);
	head3.render();

	var head4 = new Cube();
	head4.color = furColor;
	head4.matrix = head3Mat;
	head4.matrix.translate(0.015, 0, -0.025);

	var head4Mat = new Matrix4(head4.matrix);
	head4.matrix.scale(0.14, 0.18, 0.025);
	head4.render();

	var head5 = new Cube();
	head5.color = furColor;
	head5.matrix = head4Mat;
	head5.matrix.translate(0.015, 0, -0.025);

	var head5Mat = new Matrix4(head5.matrix);
	head5.matrix.scale(0.11, 0.14, 0.025);
	head5.render();

	var head6 = new Cube();
	head6.color = furColor;
	head6.matrix = head5Mat;
	head6.matrix.translate(0.015, 0, -0.025);

	var head6Mat = new Matrix4(head6.matrix);
	head6.matrix.scale(0.08, 0.11, 0.025);
	head6.render();

	var head7 = new Cube();
	head7.color = furColor;
	head7.matrix = head6Mat;
	head7.matrix.translate(0.015, 0.007, -0.025);

	var head7Mat = new Matrix4(head7.matrix);
	head7.matrix.scale(0.05, 0.08, 0.025);
	head7.render();

	var head8 = new Cube();
	head8.color = furColor;
	head8.matrix = head7Mat;
	head8.matrix.translate(0.005, 0.007, -0.025);
	head8.matrix.translate(0, g_noseTwitch, 0);

	var head8Mat = new Matrix4(head8.matrix);
	var head8MatCopy = new Matrix4(head8.matrix);
	var head8MatCopy1 = new Matrix4(head8.matrix);
	head8.matrix.scale(0.04, 0.06, 0.025);
	head8.render();

	// Face Stuff
	var nose = new Cube();
	nose.color = [0.1, 0.1, 0.1, 1];
	nose.matrix = head8Mat;
	nose.matrix.translate(0.0075, 0.02, -0.0175);

	nose.matrix.scale(0.025, 0.025, 0.0175);
	nose.render();

	var mouth1 = new Cube();
	mouth1.color = [0.1, 0.1, 0.1, 1];
	mouth1.matrix = head8MatCopy;
	mouth1.matrix.translate(0.0175, 0, -0.0001)

	var mouth1Mat = new Matrix4(mouth1.matrix);
	mouth1.matrix.scale(0.005, 0.02, 0.005);
	mouth1.render();

	var mouth2 = new Cube();
	mouth2.color = [0.1, 0.1, 0.1, 1];
	mouth2.matrix = mouth1Mat;
	mouth2.matrix.translate(-0.0175, -0.0001, -0.0001)
	mouth2.matrix.scale(0.04, 0.005, 0.005);
	mouth2.render();

	var eye1 = new Cube();
	eye1.color = [0.1, 0.1, 0.1, 1];
	eye1.matrix = head3MatCopy;
	eye1.matrix.translate(-0.031, 0.1, -0.01);
	eye1.matrix.scale(0.06, 0.06, 0.06);
	var eye1Mat = new Matrix4(eye1.matrix);
	var eye1MatCopy = new Matrix4(eye1.matrix);
	eye1.render();

	var eyeGlare1 = new Cube();
	eyeGlare1.color = [1, 1, 1, 1];
	eyeGlare1.matrix = eye1MatCopy;
	eyeGlare1.matrix.translate(-0.001, 0.7001, -0.001);
	eyeGlare1.matrix.scale(0.3, 0.3, 0.3);
	eyeGlare1.render();

	var eye2 = new Cube();
	eye2.color = [0.1, 0.1, 0.1, 1];
	eye2.matrix = eye1Mat;
	eye2.matrix.translate(2.85, 0, 0);
	var eye2Mat = new Matrix4(eye2.matrix);
	eye2.render();

	var eyeGlare2 = new Cube();
	eyeGlare2.color = [1, 1, 1, 1];
	eyeGlare2.matrix = eye2Mat;
	eyeGlare2.matrix.translate(0.701, 0.7001, -0.001);
	eyeGlare2.matrix.scale(0.3, 0.3, 0.3);
	eyeGlare2.render();

	var ear1 = new Cube();
	ear1.color = darkerInsideEar;
	ear1.matrix = headEar1;
	ear1.matrix.translate(0, 0.15, 0.0499);
	ear1.matrix.rotate(20, 0, 0, 1);
	ear1.matrix.rotate(20, 0, 1, 0);
	ear1.matrix.rotate(g_leftEarAngle, 1, 0, 0);

	var ear11Mat = new Matrix4(ear1.matrix);
	var ear12Mat = new Matrix4(ear1.matrix);
	var ear13Mat = new Matrix4(ear1.matrix);
	ear1.matrix.scale(0.05, 0.33, 0.01);
	ear1.render();

	var ear11 = new Cube();
	ear11.color = insideEar;
	ear11.matrix = ear11Mat;
	ear11.matrix.translate(0, 0, -0.01);
	ear11.matrix.rotate(-10, 0, 0, 1);
	ear11.matrix.scale(0.05, 0.3, 0.01);
	ear11.render();

	var ear12 = new Cube();
	ear12.color = insideEar;
	ear12.matrix = ear12Mat;
	ear12.matrix.translate(0, 0, -0.01);
	ear12.matrix.rotate(10, 0, 0, 1);
	ear12.matrix.scale(0.05, 0.3, 0.01);
	ear12.render();
	
	var ear13 = new Cube();
	ear13.color = insideEar;
	ear13.matrix = ear13Mat;
	ear13.matrix.translate(-0.05, 0.28, -0.01);
	
	var ear14Mat = new Matrix4(ear13.matrix);
	ear13.matrix.scale(0.05, 0.05, 0.01);
	ear13.render();

	var ear16 = new Cube();
	ear16.color = insideEar;
	ear16.matrix = new Matrix4(ear13.matrix);
	ear16.matrix.translate(2, 0, 0);
	ear16.render();

	var ear14 = new Cube();
	ear14.color = insideEar;
	ear14.matrix = ear14Mat;
	ear14.matrix.translate(0.015, 0.05, 0);

	var ear15Mat = new Matrix4(ear14.matrix);
	ear14.matrix.scale(0.12, 0.02, 0.01);
	ear14.render();

	var ear15 = new Cube();
	ear15.color = insideEar;
	ear15.matrix = ear15Mat;
	ear15.matrix.translate(0.015, 0.02, 0);

	ear15.matrix.scale(0.09, 0.02, 0.01);
	ear15.render();

	var coverEar1 = new Cube();
	coverEar1.color = furColor;
	coverEar1.matrix = new Matrix4(ear1.matrix);
	coverEar1.matrix.translate(0, 0, 1);
	coverEar1.render();

	var coverEar11 = new Cube();
	coverEar11.color = furColor;
	coverEar11.matrix = new Matrix4(ear11.matrix);
	coverEar11.matrix.translate(0, 0, 1);
	coverEar11.render();

	var coverEar12 = new Cube();
	coverEar12.color = furColor;
	coverEar12.matrix = new Matrix4(ear12.matrix);
	coverEar12.matrix.translate(0, 0, 1);
	coverEar12.render();

	var coverEar13 = new Cube();
	coverEar13.color = furColor;
	coverEar13.matrix = new Matrix4(ear13.matrix);
	coverEar13.matrix.translate(0, 0, 1.001);
	coverEar13.matrix.scale(3, 1, 1);
	coverEar13.render();

	var coverEar14 = new Cube();
	coverEar14.color = furColor;
	coverEar14.matrix = new Matrix4(ear14.matrix);
	coverEar14.matrix.translate(0, 0, 1);
	coverEar14.render();

	var coverEar15 = new Cube();
	coverEar15.color = furColor
	coverEar15.matrix = new Matrix4(ear15.matrix);
	coverEar15.matrix.translate(0, 0, 1);
	coverEar15.render();

	var ear2 = new Cube();
	ear2.color = darkerInsideEar;
	ear2.matrix = headEar2;
	ear2.matrix.translate(0.1825, 0.165, 0.0325);
	ear2.matrix.rotate(-20, 0, 0, 1);
	ear2.matrix.rotate(-20, 0, 1, 0);
	ear2.matrix.rotate(g_rightEarAngle, 1, 0, 0);

	var ear21Mat = new Matrix4(ear2.matrix);
	var ear22Mat = new Matrix4(ear2.matrix);
	var ear23Mat = new Matrix4(ear2.matrix);
	ear2.matrix.scale(0.05, 0.33, 0.01);
	ear2.render();
	
	var ear21 = new Cube();
	ear21.color = insideEar;
	ear21.matrix = ear21Mat;
	ear21.matrix.translate(0, 0, -0.01);
	ear21.matrix.rotate(-10, 0, 0, 1);
	ear21.matrix.scale(0.05, 0.3, 0.01);
	ear21.render();
	
	var ear22 = new Cube();
	ear22.color = insideEar;
	ear22.matrix = ear22Mat;
	ear22.matrix.translate(0, 0, -0.01);
	ear22.matrix.rotate(10, 0, 0, 1);
	ear22.matrix.scale(0.05, 0.3, 0.01);
	ear22.render();

	var ear23 = new Cube();
	ear23.color = insideEar;
	ear23.matrix = ear23Mat;
	ear23.matrix.translate(-0.05, 0.28, -0.01);
	
	var ear24Mat = new Matrix4(ear23.matrix);
	ear23.matrix.scale(0.05, 0.05, 0.01);
	ear23.render();

	var ear26 = new Cube();
	ear26.color = insideEar;
	ear26.matrix = new Matrix4(ear23.matrix);
	ear26.matrix.translate(2, 0, 0);
	ear26.render();

	var ear24 = new Cube();
	ear24.color = insideEar;
	ear24.matrix = ear24Mat;
	ear24.matrix.translate(0.015, 0.05, 0);

	var ear25Mat = new Matrix4(ear24.matrix);
	ear24.matrix.scale(0.12, 0.02, 0.01);
	ear24.render();

	var ear25 = new Cube();
	ear25.color = insideEar;
	ear25.matrix = ear25Mat;
	ear25.matrix.translate(0.015, 0.02, 0);

	ear25.matrix.scale(0.09, 0.02, 0.01);
	ear25.render();

	var coverEar2 = new Cube();
	coverEar2.color = furColor;
	coverEar2.matrix = new Matrix4(ear2.matrix);
	coverEar2.matrix.translate(0, 0, 1);
	coverEar2.render();
	
	var coverEar21 = new Cube();
	coverEar21.color = furColor;
	coverEar21.matrix = new Matrix4(ear21.matrix);
	coverEar21.matrix.translate(0, 0, 1);
	coverEar21.render();

	var coverEar22 = new Cube();
	coverEar22.color = furColor;
	coverEar22.matrix = new Matrix4(ear22.matrix);
	coverEar22.matrix.translate(0, 0, 1);
	coverEar22.render();

	var coverEar23 = new Cube();
	coverEar23.color = furColor;
	coverEar23.matrix = new Matrix4(ear23.matrix);
	coverEar23.matrix.translate(0, 0, 1.001);
	coverEar23.matrix.scale(3, 1, 1);
	coverEar23.render();

	var coverEar24 = new Cube();
	coverEar24.color = furColor;
	coverEar24.matrix = new Matrix4(ear24.matrix);
	coverEar24.matrix.translate(0, 0, 1);
	coverEar24.render();

	var coverEar25 = new Cube();
	coverEar25.color = furColor;
	coverEar25.matrix = new Matrix4(ear25.matrix);
	coverEar25.matrix.translate(0, 0, 1);
	coverEar25.render();

	var whisk1 = new Cube();
	whisk1.color = [0.1, 0.1, 0.1, 1];
	whisk1.matrix = head8MatCopy1;
	whisk1.matrix.translate(0.04, 0.005, 0.01);
	whisk1.matrix.rotate(-10, 0, 1, 0);

	var whisk1Mat = new Matrix4(whisk1.matrix);
	whisk1.matrix.rotate(-10, 0, 0, 1);
	whisk1.matrix.scale(0.075, 0.0025, 0.0025);
	whisk1.render();

	var whisk2 = new Cube();
	whisk2.color = [0.1, 0.1, 0.1, 1];
	whisk2.matrix = whisk1Mat;
	whisk2.matrix.translate(0, 0.02, 0);

	var whisk2Mat = new Matrix4(whisk2.matrix);
	whisk2.matrix.scale(0.075, 0.0025, 0.0025);
	whisk2.render();

	var whisk3 = new Cube();
	whisk3.color = [0.1, 0.1, 0.1, 1];
	whisk3.matrix = whisk2Mat;
	whisk3.matrix.translate(0, 0.02, 0);

	var whisk3Mat = new Matrix4(whisk3.matrix);
	whisk3.matrix.rotate(10, 0, 0, 1);
	whisk3.matrix.scale(0.075, 0.0025, 0.0025);
	whisk3.render();

	var whisk4 = new Cube();
	whisk4.color = [0.1, 0.1, 0.1, 1];
	whisk4.matrix = whisk3Mat;
	whisk4.matrix.translate(-0.04, -0.0375, 0.0075);
	whisk4.matrix.rotate(20, 0, 1, 0);
	whisk4.matrix.rotate(180, 0, 0, 1);

	var whisk4Mat = new Matrix4(whisk4.matrix);
	whisk4.matrix.rotate(10, 0, 0, 1);
	whisk4.matrix.scale(0.075, 0.0025, 0.0025);
	whisk4.render();

	var whisk5 = new Cube();
	whisk5.color = [0.1, 0.1, 0.1, 1];
	whisk5.matrix = whisk4Mat;
	whisk5.matrix.translate(0, -0.02, 0);

	var whisk5Mat = new Matrix4(whisk5.matrix);
	whisk5.matrix.scale(0.075, 0.0025, 0.0025);
	whisk5.render();

	var whisk6 = new Cube();
	whisk6.color = [0.1, 0.1, 0.1, 1];
	whisk6.matrix = whisk5Mat;
	whisk6.matrix.translate(0, -0.02, 0);
	whisk6.matrix.rotate(-10, 0, 0, 1);
	whisk6.matrix.scale(0.075, 0.0025, 0.0025);
	whisk6.render();

	// Arms
	var arm1 = new Cube();
	arm1.color = furColor;
	arm1.matrix = body4MatCopy1;
	arm1.matrix.translate(0, 0, 0.1375);
	arm1.matrix.rotate(180, 1, 0, 0);
	arm1.matrix.rotate(g_leftArmAngle, 0, 0, 1);

	var arm1Mat = new Matrix4(arm1.matrix);
	arm1.matrix.scale(0.1, 0.04, 0.04);
	arm1.render();

	var claw1 = new Prism();
	claw1.color = [1,1,1,1];
	claw1.matrix = arm1Mat;
	claw1.matrix.translate(0.1, 0.013, 0);
	claw1.matrix.rotate(-90, 0, 0, 1);

	var claw1Mat = new Matrix4(claw1.matrix);
	claw1.matrix.scale(0.013, 0.04, 0.08);
	claw1.render();

	var claw2 = new Prism();
	claw2.color = [1,1,1,1];
	claw2.matrix = claw1Mat;
	claw2.matrix.translate(-0.013, 0, 0);

	var claw2Mat = new Matrix4(claw2.matrix);
	claw2.matrix.scale(0.013, 0.04, 0.08);
	claw2.render();

	var claw3 = new Prism();
	claw3.color = [1,1,1,1];
	claw3.matrix = claw2Mat;
	claw3.matrix.translate(-0.013, 0, 0);
	claw3.matrix.scale(0.013, 0.04, 0.08);
	claw3.render();

	var arm2 = new Cube();
	arm2.color = furColor;
	arm2.matrix = body4MatCopy2;
	arm2.matrix.translate(0.225, 0, 0.0975);
	arm2.matrix.rotate(180, 1, 0, 0);
	arm2.matrix.rotate(180, 0, 1, 0);
	arm2.matrix.rotate(g_rightArmAngle, 0, 0, 1);

	var arm2Mat = new Matrix4(arm2.matrix);
	arm2.matrix.scale(0.1, 0.04, 0.04);
	arm2.render();

	var claw4 = new Prism();
	claw4.color = [1,1,1,1];
	claw4.matrix = arm2Mat;
	claw4.matrix.translate(0.1, 0, 0.04);
	claw4.matrix.rotate(-90, 0, 0, 1);
	claw4.matrix.rotate(180, 0, 1, 0);

	var claw4Mat = new Matrix4(claw4.matrix);
	claw4.matrix.scale(0.013, 0.04, 0.08);
	claw4.render();

	var claw5 = new Prism();
	claw5.color = [1,1,1,1];
	claw5.matrix = claw4Mat;
	claw5.matrix.translate(0.013, 0, 0);

	var claw5Mat = new Matrix4(claw5.matrix);
	claw5.matrix.scale(0.013, 0.04, 0.08);
	claw5.render();

	var claw6 = new Prism();
	claw6.color = [1,1,1,1];
	claw6.matrix = claw5Mat;
	claw6.matrix.translate(0.013, 0, 0);

	claw6.matrix.scale(0.013, 0.04, 0.08);
	claw6.render();

	var leg1 = new Cube();
	leg1.color = furColor;
	leg1.matrix = body3MatCopy1;
	leg1.matrix.translate(-0.125/3, 0.15 , 0.125);
	leg1.matrix.rotate(180, 1, 0, 0);
	leg1.matrix.rotate(g_leftThighAngle, 1, 0, 0);

	var leg1Mat = new Matrix4(leg1.matrix);
	leg1.matrix.scale(0.125/3, 0.125/1.5, 0.125*1.2);
	leg1.render();

	var leg11 = new Cube();
	leg11.color = tailMid;
	leg11.matrix = leg1Mat;
	leg11.matrix.translate((0.125/3-0.125*1/4)-0.001, 0.001, 0.125*1.2-0.001);
	leg11.matrix.rotate(g_leftUpperLegAngle, 1, 0, 0);

	var leg11Mat = new Matrix4(leg11.matrix);
	leg11.matrix.scale(0.125/4, 0.125/4, 0.125*1.6)
	leg11.render();

	var leg12 = new Cube();
	leg12.color = tailMid;
	leg12.matrix = leg11Mat;
	leg12.matrix.translate(0, (0.125/4-0.001)/2, 0.125*1.35-0.001);
	leg12.matrix.rotate(g_leftLowerLegAngle, 1, 0, 0);

	var leg12Mat = new Matrix4(leg12.matrix);
	leg12.matrix.scale(0.125/4, 0.125/4, 0.125*2)
	leg12.render();

	var feet1 = new Prism();
	feet1.color = [203/255, 169/255, 144/255, 1];
	feet1.matrix = leg12Mat;
	feet1.matrix.translate(0.125/2-0.125/8, 0.125/4, 0.125*2);
	feet1.matrix.rotate(180, 0, 0, 1);
	feet1.matrix.rotate(-g_leftFootAngle, 1, 0, 0);
	feet1.matrix.scale(0.125/2, 0.125*0.75, 0.125);
	feet1.render();

	var leg2 = new Cube();
	leg2.color = furColor;
	leg2.matrix = body3MatCopy2;
	leg2.matrix.translate(0.25, 0.15 , 0.125);
	leg2.matrix.rotate(180, 1, 0, 0);
	leg2.matrix.rotate(g_rightThighAngle, 1, 0, 0);

	var leg2Mat = new Matrix4(leg2.matrix);
	leg2.matrix.scale(0.125/3, 0.125/1.5, 0.125*1.2);
	leg2.render();

	var leg21 = new Cube();
	leg21.color = tailMid;
	leg21.matrix = leg2Mat;
	leg21.matrix.translate(0.001, 0.001, 0.125*1.2-0.001);
	leg21.matrix.rotate(g_rightUpperLegAngle, 1, 0, 0);

	var leg21Mat = new Matrix4(leg21.matrix);
	leg21.matrix.scale(0.125/4, 0.125/4, 0.125*1.6)
	leg21.render();

	var leg22 = new Cube();
	leg22.color = tailMid;
	leg22.matrix = leg21Mat;
	leg22.matrix.translate(0, (0.125/4-0.001)/2, 0.125*1.35-0.001);
	leg22.matrix.rotate(g_rightLowerLegAngle, 1, 0, 0);

	var leg22Mat = new Matrix4(leg22.matrix);
	leg22.matrix.scale(0.125/4, 0.125/4, 0.125*2)
	leg22.render();

	var feet2 = new Prism();
	feet2.color = [203/255, 169/255, 144/255, 1];
	feet2.matrix = leg22Mat;
	feet2.matrix.translate(0.125/2-0.125/8, 0.125/4, 0.125*2);
	feet2.matrix.rotate(180, 0, 0, 1);
	feet2.matrix.rotate(-g_rightFootAngle, 1, 0, 0);
	feet2.matrix.scale(0.125/2, 0.125*0.75, 0.125);
	feet2.render();

    /*
    var leftArm = new Cube();
    leftArm.color = [1,1,0,1];
    leftArm.matrix.setTranslate(0, -0.5, 0);
    leftArm.matrix.rotate(-5, 1, 0, 0);
  
    if (g_yellowAnimation) {
      leftArm.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);
    } else {
      leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
    }
  
    var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
    leftArm.matrix.scale(0.25, 0.7, 0.5);
    leftArm.matrix.translate(-0.5, 0, 0);
    leftArm.render();
  
    var box = new Cube()
    box.color = [1,0,1,1];
    box.matrix = yellowCoordinatesMat;
    box.matrix.translate(0, 0.65, 0);
    box.matrix.rotate(g_magentaAngle, 0, 0, 1);
    box.matrix.scale(0.3, 0.3, 0.3);
    box.matrix.translate(-0.5, 0, -0.001);
    box.render();
    */
}