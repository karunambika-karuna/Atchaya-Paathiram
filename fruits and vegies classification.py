#!/usr/bin/env python
# coding: utf-8

# In[23]:


import tensorflow as tf
import numpy as np
from PIL import Image
import matplotlib.image as img
import matplotlib.pyplot as plt
import pathlib
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import Sequential
from tensorflow.keras.layers import *
import os
from tensorflow.keras.models import *
from keras.preprocessing import image
import warnings
warnings.filterwarnings('ignore')
from keras.preprocessing import image


# In[24]:


import os

train_path = "T:/datasets/train"  # Use forward slashes or escape backward slashes
test_path = "T:/datasets/test"
val_path = "T:/datasets/validation"
image_category = os.listdir(train_path)  # Use the correct path variable

print(image_category)


# In[31]:


import os
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import load_img, img_to_array

def plot_image(image_category, train_path):
    plt.figure(figsize=(10, 10))

    for i, category in enumerate(image_category):
        image_path = os.path.join(train_path, category)
        image_in_folder = os.listdir(image_path)

        first_image = image_in_folder[0]
        first_image_in_path = os.path.join(image_path, first_image)
        img = load_img(first_image_in_path)
        img_array = img_to_array(img) / 255
        plt.subplot(7, 6, i + 1)
        plt.imshow(img_array)
        plt.title(category)
        plt.axis('off')

    plt.show()



# In[32]:


plot_image(image_category, train_path)


# In[33]:


train_generator = ImageDataGenerator(rescale = 1.0/255.0)
train_image_generator = train_generator.flow_from_directory(
                                                train_path,
                                                target_size = (224, 224),
                                                batch_size = 32,
                                                class_mode = 'categorical'
                                                )

test_generator = ImageDataGenerator(rescale = 1.0/255.0)
test_image_generator = test_generator.flow_from_directory(
                                                test_path,
                                             target_size = (224, 224),
                                                batch_size = 32,
                                                class_mode = 'categorical'
                                                )
val_generator = ImageDataGenerator(rescale = 1.0/255.0)
val_image_generator = val_generator.flow_from_directory(
                                                val_path,
                                               target_size = (224, 224),
                                                batch_size = 32,
                                                class_mode = 'categorical'
                                                )


# In[34]:


cnn_model = Sequential()
cnn_model.add(Conv2D(filters = 32, kernel_size = 3,  padding = 'same', activation = 'relu',
                     input_shape = (224, 224, 3)))
cnn_model.add(MaxPooling2D(pool_size= (2,2)))
cnn_model.add(Conv2D(filters = 64, kernel_size = 3, padding = 'same', activation = 'relu'))
cnn_model.add(MaxPooling2D())
cnn_model.add(Conv2D(filters = 64, kernel_size = 3, padding = 'same',  activation = 'relu'))
cnn_model.add(MaxPooling2D())
cnn_model.add(Conv2D(filters=64, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(MaxPooling2D())
cnn_model.add(Conv2D(filters=64, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(MaxPooling2D())
cnn_model.add(Conv2D(filters=64, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(MaxPooling2D())
cnn_model.add(Conv2D(filters=128, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(MaxPooling2D())
cnn_model.add(Dropout(0.2))
cnn_model.add(Conv2D(filters=128, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(Conv2D(filters=128, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(Conv2D(filters = 128, kernel_size = 3,  padding = 'same',   activation = 'relu'))
cnn_model.add(Conv2D(filters=128, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(Conv2D(filters=265, activation='relu', padding='same',kernel_size=3 ))
cnn_model.add(Flatten())
cnn_model.add(Dense(128, activation = 'relu'))
cnn_model.add(Dense(64, activation = 'relu'))
cnn_model.add(Dense(36, activation = 'softmax'))


# In[35]:


cnn_model.summary()


# In[36]:


cnn_model.compile(
    optimizer='Adam', 
    loss ='categorical_crossentropy', 
    metrics=['accuracy'])


# In[38]:


model_history = cnn_model.fit(train_image_generator,
                             epochs =2 ,
                             validation_data = val_image_generator,
                             )


# In[40]:


pretrained_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet',
    pooling='avg'
)
pretrained_model.trainable = False
inputs = pretrained_model.input

x = tf.keras.layers.Dense(128, activation='relu')(pretrained_model.output)
x = tf.keras.layers.Dense(128, activation='relu')(x)

outputs = tf.keras.layers.Dense(36, activation='softmax')(x)

model = tf.keras.Model(inputs=inputs, outputs=outputs)

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
model_history_2 = model.fit(
                         train_image_generator,
                             epochs =2 ,
                             validation_data = val_image_generator,
                               batch_size = 32,
     
    callbacks=[
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=2,
            restore_best_weights=True
        )
    ]
)


# In[41]:


hist = model_history.history
plt.style.use('ggplot')
plt.figure(figsize = (10,5))

#loss history
plt.plot(hist['loss'], c = 'red', label = 'train loss')
plt.plot(hist['val_loss'], c = 'red', label = 'validation loss', linestyle = '--')

#accuracy history
plt.plot(hist['accuracy'], c = 'blue', label = 'train accuracy')
plt.plot(hist['val_accuracy'], c = 'blue', label = 'validation accuracy', linestyle = '--')


plt.xlabel("number of epochs")
plt.show()


# In[42]:


hist = model_history_2.history
plt.style.use('ggplot')
plt.figure(figsize = (10,5))

#loss history
plt.plot(hist['loss'], c = 'red', label = 'train loss')
plt.plot(hist['val_loss'], c = 'red', label = 'validation loss', linestyle = '--')

#accuracy history
plt.plot(hist['accuracy'], c = 'blue', label = 'train accuracy')
plt.plot(hist['val_accuracy'], c = 'blue', label = 'validation accuracy', linestyle = '--')


plt.xlabel("number of epochs")
plt.show()


# In[43]:


cnn_model.evaluate(test_image_generator)
cnn_model.evaluate(train_image_generator)
cnn_model.evaluate(val_image_generator)


# In[44]:


model.evaluate(test_image_generator)
model.evaluate(train_image_generator)
model.evaluate(val_image_generator)


# In[45]:


labels = {value: key for key, value in train_image_generator.class_indices.items()}

print("Label Mappings for classes \n")
for key, value in labels.items():
    print(f"{key} : {value}")


# In[46]:


ModelLoss, ModelAccuracy = cnn_model.evaluate(test_image_generator)

print('Test Loss is {}'.format(ModelLoss))
print('Test Accuracy is {}'.format(ModelAccuracy ))


# In[102]:


class_map = dict([v,k] for k,v in train_image_generator.class_indices.items())
print(class_map)


# In[8]:


import numpy as np
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt
test_image_path ="T:/datasets/train/apple/Image_2.jpg"
def predictions(test_image_path, actual_label):


    #load and preprocessing image
    test_img = image.load_img(test_image_path, target_size = (224, 224))
    test_img_arr = image.img_to_array(test_img)/ 255.0
    test_img_input = test_img_arr.reshape((1, test_img_arr.shape[0], test_img_arr.shape[1] , test_img_arr.shape[2]))

    # prediction
    predicted_label = np.argmax(model.predict(test_img_input))
    predicted_img = class_map[predicted_label]


    plt.figure(figsize = (4,4))
    plt.imshow(test_img_arr)
    plt.title("predicted label: {}, actual label : {}".format (predicted_img, actual_label))
    plt.grid()
    plt.axis('off')
    plt.show()


# In[10]:


predictions(test_image_path, actual_label =None)


# In[ ]:




