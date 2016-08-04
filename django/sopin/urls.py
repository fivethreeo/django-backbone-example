from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin

from django.views.generic import TemplateView

from tastypie.api import Api
from sopin.menus.api import RestaurantResource, DishResource, DishTypeResource, RestaurantDishTypeResource, KitchenResource, IndgredientResource, DishFlattenedResource


v1_api = Api(api_name='v1')
v1_api.register(RestaurantResource())
v1_api.register(DishResource())
v1_api.register(DishTypeResource())
v1_api.register(RestaurantDishTypeResource())
v1_api.register(KitchenResource())
v1_api.register(IndgredientResource())
v1_api.register(DishFlattenedResource())

urlpatterns = [
    url('^$', TemplateView.as_view(template_name="index.html")),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(v1_api.urls))
]