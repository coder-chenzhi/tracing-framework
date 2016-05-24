## Chinese version
总体上说，目前有两种导入方式，分别是构建Maven工程和构建Java工程。两种方法各有利弊：前者可通过网络自动下载依赖的第三方库，但源代码会被分散到多个工程中进而带来阅读上的不便；后者可将所有源代码组织在一个工程中，但需要自己添加依赖的第三方库，大家可以根据自己的喜好选择一种方法。

## 构建Java工程
首先解压缩源代码  

打开Eclipse，进入Eclipse可视化界面后，依次单击"File" -> "New" -> "JavaProject"，并在弹出的对话框中去掉"Use default location"前的勾号，然后选择源码所在目录。默认情况下，工程名称与Hadoop安装目录名称相同即可。单击"完成"按钮，源码工程创建完毕。  

需要注意的是，通过以上方法导入源码后，很多类或方法找不到对应的JAR包，为了解决这个问题，需要自己手动将第三方JAR包导入工程中。首先要下载缺失的JAR包，可以按照pom.xml文件的内容，去http://mvnrepository.com/查找对应版本的下载地址。  

然后右击Project名称，在弹出的快捷菜单中选择"Properties"命令，将会弹出一个界面，然后在该界面中依次选择"Java Build Path" -> "Libraries" -> "Add External JARs..."，将下载的第三方JAR包导入工程。其中，有个地方需要注意，com.sun.jdi这个包需要导入JDK的tools.jar。  

然而，你仍会发现部分类或者函数无法找到，这是因为Pivot Tracing使用了Protocol Buffers定义RPC协议，而这些Protocol Buffers文件在Maven编译源代码时才会生成对应的Java类，因此其他类在源代码中引用这些类则暂时无法找到，解决方法是先编译Pivot Tracing源代码或者自己手动编译这些proto文件，再导入Eclipse工程  
分别进入下列文件夹  
```
tracing-framework/pivottracing/common
tracing-framework/retro/aggregation
tracing-framework/retro/throttling/
tracing-framework/xtrace/common
tracing-framework/tracingplane/client
tracing-framework/tracingplane/pubsub
```
然后运行下面的命令  
```
protoc --java_out=src/main/java/ src/main/protobuf/*.proto
```
