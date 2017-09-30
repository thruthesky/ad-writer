# Ad Writer

This is a writing software. You can write once and this will deliver to all over the world.


# Logger

https://github.com/thruthesky/keyword-rank-observer


# Posting

# SEO Monitoring



# 사용법

* `순위 집계 키워드` 설정에서 순위 집계 및 통계를 내고자하는 키워드를 입력한다. 키워드가 많으면 부하가 걸리므로
    * 데스크톱 최대 20개,
    * 모바일 최대 30개로 제한한다.

* `네이버 순위 모니터링` 페이지에서, 기본적으로 모든 `순위 집계 키워드`가 다 표시되는데,
    원하는 몇몇 키워드만 표시하고자 한다면, 
    `모니터링 할 키워드` 설정에서 표시(모니터링)하고 싶은 키워드만 선택하여 모니터링 할 수 있다. ( 이 때, 모니터링 페이지에 나타나는 키워드 순서를 바꿀 수 있다. )


# Development

* @see [Mr. Song's Documentation](https://docs.google.com/document/d/19C0kwNq9mMgun9Cl66Y-Hf-Yxdq4HpWAG0Mbf4d7jo8/edit#heading=h.m3ribc4ake2e)


## Installation

$ npm i
$ git submodule update --init
$ git submodule foreach git checkout master



## DB structure

/adv/keyword-rank-naver - node + nightmare 로 naver 키워드 랭킹을 집계하여 저장하는 곳.




