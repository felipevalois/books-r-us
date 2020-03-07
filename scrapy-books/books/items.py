# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BooksItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    # pass
    department = scrapy.Field()
    courseNumber = scrapy.Field()
    className = scrapy.Field()
    professor = scrapy.Field()
    isbn = scrapy.Field()
    section = scrapy.Field()
    status = scrapy.Field()
    sectionId = scrapy.Field()
    price = scrapy.Field()
    condition = scrapy.Field()