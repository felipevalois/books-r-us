# -*- coding: utf-8 -*-
import scrapy
from . import courses, helper
from .. import items

class BookspiderSpider(scrapy.Spider):
    name = 'bookspider'
    allowed_domains = ['https://mu.verbacompare.com']
    start_url = 'https://mu.verbacompare.com/print/'
    start_urls = []

    #Using file containing scraped array of ids that correspond to each section
    for item in courses.dataz:
        for i in item.values():
            start_urls.append(start_url+i)

    def parse(self, response):
        SET_SELECTOR = "table.printable_items > tr"
        CLASS_SELECTOR = "normalize-space(.//*[@id='print-by-section']/div/text())"
        classInfo = response.xpath(CLASS_SELECTOR).extract_first()
        classArray = classInfo.split()

        for obj in response.css(SET_SELECTOR):        
            ISBN_SELECTOR = "normalize-space(.//table/tr[3]/td[2]/text())"
            STATUS_SELECTOR = "normalize-space(.//table/tr[4]/td[2]/text())"
            CONDITION_SELECTOR = ".variant ::text"
            PRICE_SELECTOR = ".price ::text"
            item = items.BooksItem()

            item['department'] = classArray[1]
            item['courseNumber'] = classArray[2]
            item['className'],item['section'] = helper.getClassAndSection(classArray)
            item['professor'] = helper.getProf(classArray)
            item['sectionId'] = helper.getId(response.url)
            item['isbn'] = obj.xpath(ISBN_SELECTOR).extract_first()
            item['status'] = helper.status(obj.xpath(STATUS_SELECTOR).extract_first())
            item['price'] = obj.css(PRICE_SELECTOR).extract()
            item['condition'] = obj.css(CONDITION_SELECTOR).extract()

            yield item